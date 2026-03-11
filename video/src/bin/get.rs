use std::error::Error;
use reqwest::Client;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let api_key = env::var("VIDEO_GENERATOR_API_KEY")
        .expect("VIDEO_GENERATOR_API_KEY not set");

    let client = Client::new();
    let url = "http://localhost:4747/video/to-generate";

    // Sending the GET request
    let response = client.get(url)
        .bearer_auth(api_key)
        .send()
        .await?;

    println!("{:#?}", response);
    println!("Response body: {:?}", response.text().await?);

    Ok(())
}