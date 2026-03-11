export function getDbName(uri: string): string {
    const url = new URL(uri);
    return url.pathname.slice(1);
}
