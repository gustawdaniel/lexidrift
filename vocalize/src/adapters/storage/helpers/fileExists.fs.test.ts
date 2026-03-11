import {expect, test} from "vitest";
import {fileExistsFs} from "./fileExists.fs";

test('fileExists', async () => {
    expect(await fileExistsFs('/')).toBeFalsy()
    expect(await fileExistsFs(__dirname + '/fileExists.fs.ts')).toBeTruthy()
})
