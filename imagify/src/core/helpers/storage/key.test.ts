import { expect, test } from "vitest";
import {Key} from "./key";

test('key', () => {
    const key = Key.compose("model", "prompt");
    expect(key.endsWith('.jpg')).toBeTruthy();
});