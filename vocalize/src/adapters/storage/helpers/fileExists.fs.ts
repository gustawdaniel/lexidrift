import fs from 'fs/promises';

export async function fileExistsFs(path: string): Promise<boolean> {
    try {
        const stat = await fs.lstat(path);
        return stat.isFile();
    } catch (err) {
        if (err instanceof Error) {
            return false;
        } else {
            throw err; // Throw if it's another type of error
        }
    }
}
