use std::{env};
use std::error::Error;
use serde::{Deserialize};
use reqwest::{get, Client, StatusCode};
use chrono::Utc;
use tokio::{fs::File, io::AsyncWriteExt};
use std::fs;
use std::io::Read;
use std::path::Path;
use tokio::time::sleep;
use std::process::Command;

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::Mutex;
use tokio::task;

#[derive(PartialEq)]
enum GenerationResult {
    Generated,
    Empty,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct VideoGenerationSegment {
    audio_url: String,
    image_url: String,
    text: String,
    highlight: String
}

#[derive(Deserialize, Debug, Clone)]
struct VideoGenerationTask {
    id: String,
    segments: Vec<VideoGenerationSegment>,
}

struct Route {}

impl Route {
    fn video_to_generate() -> String {
        let base_url = env::var("API_URL")
            .expect("API_URL not set");

        format!("{}/video/to-generate", base_url)
    }

    fn upload_generated_video(task: &VideoGenerationTask) -> String {
        let base_url = env::var("API_URL")
            .expect("API_URL not set");

        format!("{}/video/upload/{}", base_url, task.id)
    }
}

async fn get_single_generation_task() -> Result<Option<VideoGenerationTask>, Box<dyn Error>> {
    let url = Route::video_to_generate();
    let api_key = env::var("VIDEO_GENERATOR_API_KEY")
        .expect("VIDEO_GENERATOR_API_KEY not set");
    let client = Client::new();

    let response_result = client.get(url)
        .bearer_auth(api_key)
        .send()
        .await;

    let response = match response_result {
        Ok(resp) => resp,
        Err(err) => {
            eprintln!("Failed to send request: {}", err);
            return Err(Box::new(err));
        }
    };

    println!("{} Status: {}", Utc::now().time(), response.status());

    match response.status() {
        StatusCode::OK => {
            let data = response.json::<VideoGenerationTask>().await.ok().unwrap();

            // println!("Response body: {:?}", &data);

            Ok(Some(data))
        }
        _ => Ok(None)
    }
}

use sha1::{Digest, Sha1};
use hex;

fn get_file_name(url: &str) -> String {
    let mut hasher = Sha1::new();
    hasher.update(url.as_bytes()); // Hash the URL
    let hash = hex::encode(hasher.finalize()); // Convert hash to hex string

    format!(".cache/{}.{}", hash, url.split('.').last().unwrap_or("bin"))
}

fn ensure_cache_dir() {
    let cache_dir = ".cache";

    if !Path::new(cache_dir).exists() {
        fs::create_dir(cache_dir).expect("Failed to create .cache directory");
    }
}

fn clear_parts_from_cache() {
    let cache_dir = ".cache";

    let paths = fs::read_dir(cache_dir).unwrap();
    for path in paths {
        let path = path.unwrap().path();
        if path.is_file() && ( path.to_str().unwrap().contains("part_") || path.to_str().unwrap().contains(".txt") ) {
            fs::remove_file(path).unwrap();
        }
    }
}

const S3_DELAY_SECONDS: f64 = 1.0;  // Delay for 429 retries (optional)

async fn download_file(url: &str, file_name: &str) -> Result<(), Box<dyn Error>> {
    if Path::new(file_name).exists() {
        println!("File {} already exists, skipping download.", file_name);
        return Ok(());
    }

    let mut retries = 0;
    loop {
        // Attempt the download
        let response = match get(url).await {
            Ok(r) => r,
            Err(e) => {
                eprintln!("Request error: {}", e);
                return Err(Box::new(e));
            }
        };

        match response.status() {
            StatusCode::OK => {
                // Successful response, download the file
                let response_bytes = response.bytes().await?;
                let mut file = File::create(file_name).await?;
                file.write_all(&response_bytes).await?;
                println!("Downloaded {}", file_name);
                return Ok(());
            }
            StatusCode::TOO_MANY_REQUESTS => {
                // Handle 429 - Too Many Requests (rate limiting)
                retries += 1;
                if retries > 5 {
                    return Err("Too many retries, giving up.".into());
                }
                println!("Received 429, retrying... (Attempt: {})", retries);
                let backoff_duration = Duration::from_secs_f64(S3_DELAY_SECONDS * retries as f64);
                sleep(backoff_duration).await;
            }
            _ => {
                // Handle other non-OK responses
                eprintln!("Failed to download file: HTTP {}", response.status());
                return Err(format!("Failed to download file: HTTP {}", response.status()).into());
            }
        }
    }
}

async fn store_segments_locally(task: &VideoGenerationTask) -> Result<Vec<(String, String, String, String)>, Box<dyn Error>> {
    let mut local_files = Vec::new();

    for segment in &task.segments {
        let image_file_name = get_file_name(&segment.image_url);
        let audio_file_name = get_file_name(&segment.audio_url);

        download_file(&segment.image_url, &image_file_name).await?;
        download_file(&segment.audio_url, &audio_file_name).await?;

        local_files.push((image_file_name, audio_file_name, segment.text.clone(), segment.highlight.clone()));
    }

    println!("Local files: {:?}", local_files);

    Ok(local_files)
}


async fn upload_generated_video(task: &VideoGenerationTask) -> Result<(), Box<dyn Error>> {
    let api_key = env::var("VIDEO_GENERATOR_API_KEY")
        .expect("VIDEO_GENERATOR_API_KEY not set");

    let url = Route::upload_generated_video(task);
    let client = Client::new();
    let file_path = format!(".cache/merged.{}", "mp4");
    let ext_string = format!("{}", "mp4");
    let content_type = format!("video/{}", "mp4");

    // Open the file and read its contents into a buffer
    let mut file = std::fs::File::open(file_path)?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;

    // Sending the PUT request
    let response = client.put(url)
        .body(buffer) // Pass the buffer directly, not a reference
        .header("file-extension", ext_string)
        .header("content-type", content_type)
        .bearer_auth(api_key)
        .send()
        .await?;

    // Printing the response
    println!("Status: {}", response.status());
    println!("Response body: {:?}", response.text().await?);
    Ok(())
}



async fn make_single_video_generation() -> Result<GenerationResult, Box<dyn Error>> {
    let task = get_single_generation_task().await.ok().unwrap();

    match task {
        Some(task) => {
            // println!("Task: {:?}", task);
            let local_files = store_segments_locally(&task).await.ok().unwrap();

            clear_parts_from_cache();

            generate_ffmpeg_script(&*local_files).await.ok();

            upload_generated_video(&task).await.ok();

            Ok(GenerationResult::Generated)
        }
        None => Ok(GenerationResult::Empty)
    }
}


async fn generate_ffmpeg_script(local_files: &[(String, String, String, String)]) -> Result<(), Box<dyn Error>> {
    // Step 1: Create individual video clips with proper audio/video sync
    let mut video_parts = vec![];
    for (i, (image, audio, text, _highlight)) in local_files.iter().enumerate() {
        let text_overlay = format!(
            "drawtext=text='{}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h-text_h-10:box=1:boxcolor=black@0.5:boxborderw=10",
            text
        );

        // vp9 or av1 as video codec for better compression
        // opus for audio codec for better quality
        let video_part = format!(".cache/part_{}.ts", i); // Use .ts format for better concatenation
        Command::new("ffmpeg")
            .args([
                "-loop", "1",
                "-i", image,
                "-i", audio,
                "-vf", &text_overlay,
                "-c:v", "libx264",
                "-tune", "stillimage",
                "-c:a", "aac",
                "-b:a", "192k",
                "-shortest",
                "-f", "mpegts", // Use MPEG-TS format which handles concatenation better
                &video_part,
            ])
            .output()?;

        video_parts.push(video_part);
    }

    // Step 2: Convert all .ts to .mp4
    for i in 0..video_parts.len() {
        let ts_file = video_parts[i].clone();
        let mp4_file = ts_file.replace(".ts", ".mp4");
        Command::new("ffmpeg")
            .args([
                "-i", &ts_file,
                "-c", "copy",
                "-vsync", "2",
                "-y", &mp4_file,
            ])
            .output()?;
    }

    // Step 3: Create a filelist.txt file
    let mut filelist = File::create(".cache/filelist.txt").await?;
    for i in 0..video_parts.len() {
        let mp4_file = video_parts[i].replace(".ts", ".mp4");
        if let Some(stripped) = mp4_file.strip_prefix(".cache/") {
            filelist.write_all(format!("file '{}'\n", stripped).as_bytes()).await?;
        }
    }

    // Step 4: Concatenate the MP4 files
    Command::new("ffmpeg")
        .args([
            "-f", "concat",
            "-safe", "0",
            "-i", ".cache/filelist.txt",
            "-c", "copy",
            "-y", ".cache/merged.mp4",
        ])
        .output()?;

    // Add the missing return statement
    Ok(())
}

async fn background_loop(last_run: Arc<Mutex<Instant>>) {
    // let delay_seconds = 10; // Replace with env::var() parsing if needed

    loop {
        let result = make_single_video_generation().await.ok().unwrap();

        match result {
            GenerationResult::Empty => {
                // Update last run time
                let mut last_run_lock = last_run.lock().await;
                *last_run_lock = Instant::now();

                // sleep(Duration::from_secs(delay_seconds)).await;
            }
            _ => {
                println!("OK");
                // break; // Remove this in production
            }
        }
    }
}

async fn get_elapsed_time(last_run: web::Data<Arc<Mutex<Instant>>>) -> impl Responder {
    let last_run_lock = last_run.lock().await;
    let elapsed = last_run_lock.elapsed();
    if elapsed.as_secs() > 600 {
        HttpResponse::InternalServerError().body(format!("Elapsed time: {:.2?} seconds", elapsed.as_secs_f64()))
    } else {
        HttpResponse::Ok().body(format!("Elapsed time: {:.2?} seconds", elapsed.as_secs_f64()))
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    ensure_cache_dir();

    let last_run = Arc::new(Mutex::new(Instant::now()));

    // Spawn the background loop
    let last_run_clone = last_run.clone();
    task::spawn(background_loop(last_run_clone));

    // Start the HTTP server
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(last_run.clone())) // Share last run time with handlers
            .route("/", web::get().to(get_elapsed_time))
    })
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}