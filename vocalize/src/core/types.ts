export type Language = "en" | "de" | "es" | "pl" | "ru";

export interface AppError {
    message: string;
    status: number;
}
