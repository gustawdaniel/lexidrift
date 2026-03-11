import {test, expect} from "vitest";
import {normalizeLLMToJson} from "./normalizeLLMToJson";

test('normalizeLLMToJson clear', () => {
    expect(normalizeLLMToJson("{\n  \"value\": \"ok\"\n}")).toBe("{\n  \"value\": \"ok\"\n}");
})
test('normalizeLLMToJson dirty', () => {
    expect(normalizeLLMToJson("```json\n{\n  \"value\": \"ok\"\n}\n```")).toBe("{\n  \"value\": \"ok\"\n}");
})

test('normalizeLLMToJson real', () => {
    expect(normalizeLLMToJson(`\`\`\`json
{
  "correct": false,
  "feedback": "The Spanish word 'tío' translates to 'uncle' in English, not 'this'. 'Tío' can also be used informally in Spain to mean 'dude' or 'guy'."
}
\`\`\``)).toBe(`{
  "correct": false,
  "feedback": "The Spanish word 'tío' translates to 'uncle' in English, not 'this'. 'Tío' can also be used informally in Spain to mean 'dude' or 'guy'."
}`);
})

