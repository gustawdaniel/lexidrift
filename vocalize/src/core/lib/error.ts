export function getErrorMessage(error: any): string {
    console.log(error);
    if (error instanceof Error) {
        return error.message;
    }
    return String(error) ?? 'Unknown error';
}