import {expect, test} from "vitest";
import {Key} from "./key";

test("key", async () => {
    const request = {"text":"że/który","lang":"pl","style":"gtts"};

    const key = Key.compose(request.style, request.lang, request.text);
    expect(key).toEqual('gtts/pl/xbxlL2t0w7NyeQ.wav')

    const data = Key.decompose(key);
    expect(data).toEqual(request);
})

test('key with query', async () => {
    const request = {"text":"¿Tienes planes para el fin de semana?","lang":"pl","style":"gtts"};

    const key = Key.compose(request.style, request.lang, request.text);
    expect(key).toEqual('gtts/pl/wr9UaWVuZXMgcGxhbmVzIHBhcmEgZWwgZmluIGRlIHNlbWFuYT8.wav')

    const data = Key.decompose(key);
    expect(data).toEqual(request);
})