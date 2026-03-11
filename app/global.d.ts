import type {GoogleLoginCallbackPayload} from "~/types/GoogleLoginCallbackPayload";

export {};

declare global {
    interface Window {
        googleLoginCallback: (response: GoogleLoginCallbackPayload) => void;
        gapi: {
            auth2: {
                getAuthInstance: () => {
                    signOut: () => Promise<void>
                }
            }
        }
    }
}