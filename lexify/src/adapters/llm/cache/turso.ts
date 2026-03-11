import {LLMCacheAdapter, type LLMCacheRecord} from "../../../ports/llm.cache.port";
import {createClient} from "@libsql/client";
import {config} from "../../../core/config";
import assert from "node:assert/strict";
import z from "zod";
import crypto from 'crypto'
import {md5} from "./helpers/md5";

const cacheValidator = z.object({
    md5: z.string(),
    input: z.string(),
    model: z.string(),
    output: z.string(),
    finishReason: z.string(),
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
    requestTime: z.number(),
    durationMs: z.number(),
});

export function createLlmTursoCacheClient(): LLMCacheAdapter {
    const url = config.turso.url;
    const authToken = config.turso.authToken;

    assert.ok(url, 'TURSO_DATABASE_URL is required');

    const turso = createClient({
        url,
        authToken,
    });

    function getCacheKey(prompt: string, model: string): string {
        return md5(`${model}:${prompt}`);
    }

    return {
        getCacheKey,
        get: async (prompt: string, model: string): Promise<LLMCacheRecord | null> => {
            console.log('prompt, model', prompt, model);
            const key = getCacheKey(prompt, model);
            console.log('key', key);
            const result = await turso.execute({
                sql: `SELECT * FROM llm_requests WHERE md5 = ?;`,
                args: [key]
            });

            if (result.rows.length > 0) {
                const row = result.rows[0];

                const record: LLMCacheRecord = cacheValidator.parse(row);

                return {
                    md5: record.md5,
                    input: record.input,
                    model: record.model,
                    output: record.output,
                    finishReason: record.finishReason,
                    promptTokens: record.promptTokens,
                    completionTokens: record.completionTokens,
                    totalTokens: record.totalTokens,
                    requestTime: record.requestTime,
                    durationMs: record.durationMs,
                };
            }

            return null;
        },
        set: async (record: Omit<LLMCacheRecord, 'md5'>): Promise<void> => {
            const key = getCacheKey(record.input, record.model);

            await turso.execute({
                sql: `INSERT INTO llm_requests (md5, input, model, output, finishReason, promptTokens, completionTokens, totalTokens, requestTime, durationMs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                args: [key, record.input, record.model, record.output, record.finishReason, record.promptTokens, record.completionTokens, record.totalTokens, record.requestTime, record.durationMs]
            });
        }
    };
}