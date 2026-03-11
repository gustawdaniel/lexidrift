export type ImageStyle = "cartoon" | "realistic" | "abstract" | "cyberpunk magenta";

export interface ImageSelector {
    prompt: string;
    style: ImageStyle;
}

export interface SuccessImageResponse {
    success: true;
    image: string;
}
export interface ErrorImageResponse {
    success: false;
    error: string;
}
export type ImageResponse = SuccessImageResponse | ErrorImageResponse;

export interface InputAdapter {
    imaginePicture(request: ImageSelector): Promise<ImageResponse>;
}