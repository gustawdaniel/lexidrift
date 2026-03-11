use std::error::Error;
use std::process::Command;
use tokio::{fs::File, io::AsyncWriteExt};

async fn generate_ffmpeg_script(local_files: &[(String, String, String, String)]) -> Result<(), Box<dyn Error>> {
    // Step 1: Create individual video clips with proper audio/video sync
    let mut video_parts = vec![];
    for (i, (image, audio, text, _highlight)) in local_files.iter().enumerate() {
        // let text_overlay = format!(
        //     "drawtext=text='{}':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=h-text_h-10:box=1:boxcolor=black@0.5:boxborderw=10",
        //     text
        // );
        // let text_overlay = format!(
        //     "drawtext=text='{}':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=h-text_h-30:box=1:boxcolor=black@0.5:boxborderw=10",
        //     text
        // );
        let text_overlay = format!(
            "drawtext=text='{}':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=h-text_h-80:box=1:boxcolor=black@0.7:boxborderw=20",
            text
        );

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


#[tokio::main]
async fn main() {
    generate_ffmpeg_script(&[
        (
            ".cache/3079abfe5147e08b08999537973dce3b9599988b.jpg".to_string(),
            ".cache/0a4ba9977710d233e4af281d155789c17b9b2e08.wav".to_string(),
            "que".to_string(),
            "que".to_string(),
        ),
        (
            ".cache/3079abfe5147e08b08999537973dce3b9599988b.jpg".to_string(),
            ".cache/0c26ff35d52b8b45957ea9675a6ecae258184ea6.wav".to_string(),
            "that/which".to_string(),
            "that/which".to_string(),
        ),
        (
            ".cache/3079abfe5147e08b08999537973dce3b9599988b.jpg".to_string(),
            ".cache/513dcefa812d39ea28ded33efb44e33207d85d4a.wav".to_string(),
            "Sé que estás cansado.".to_string(),
            "que".to_string(),
        ),
        (
            ".cache/3079abfe5147e08b08999537973dce3b9599988b.jpg".to_string(),
            ".cache/44f2017f6656a8fa77f839a0b0e612b36684af4c.wav".to_string(),
            "I know that you are tired.".to_string(),
            "that/which".to_string(),
        ),
        (
            ".cache/07c65d1f3fe3314fc11124ef9e4806c93583251e.jpg".to_string(),
            ".cache/adb8a57995768cab988382e51a554ae286d12095.wav".to_string(),
            "de".to_string(),
            "de".to_string(),
        ),
        (
            ".cache/07c65d1f3fe3314fc11124ef9e4806c93583251e.jpg".to_string(),
            ".cache/0907de626f1252ee7a9d3ab174c81ba8256f2da2.wav".to_string(),
            "of".to_string(),
            "of".to_string(),
        ),
        (
            ".cache/07c65d1f3fe3314fc11124ef9e4806c93583251e.jpg".to_string(),
            ".cache/d6875a23999d390682c225584175650f8153d5dd.wav".to_string(),
            "El libro de Juan.".to_string(),
            "de".to_string(),
        ),
        (
            ".cache/07c65d1f3fe3314fc11124ef9e4806c93583251e.jpg".to_string(),
            ".cache/df3f94e6ed5cb8eff778d74ebc32e11c126fb7c8.wav".to_string(),
            "The book of John.".to_string(),
            "of".to_string(),
        ),
    ])
    .await.expect("Failed to generate video");
}
