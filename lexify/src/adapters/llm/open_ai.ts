import {LLMAdapter} from "../../ports/llm.port";
import OpenAI from 'openai';
import {LLMCacheAdapter} from "../../ports/llm.cache.port";
import {LogActionType, LoggerAdapter} from "../../ports/logger.port";

export function createLlmOpenApiClient(apiKey: string, options: { llmCache: LLMCacheAdapter, logger: LoggerAdapter }): LLMAdapter {
    return {
        generateText: async (prompt: string, actionType: LogActionType): Promise<string> => {
            const startTime = Date.now();

            const model = 'gpt-4o';
            const cachedResponse = await options.llmCache.get(prompt, model);

            if (cachedResponse) {
                options.logger.logCacheHit(options.llmCache.getCacheKey(prompt, model), 'define.turso', 'dev', Date.now() - startTime);
                return cachedResponse.output;
            }

            const client = new OpenAI({
                apiKey: apiKey, // This is the default and can be omitted
            });

            const llmRequestTime = Date.now();

            const chatCompletion = await client.chat.completions.create({
                messages: [{role: 'user', content: prompt}],
                model,
            });

            const llmResponseTime = Date.now();

            const answerText = chatCompletion.choices[0].message.content;

            await options.llmCache.set({
                input: prompt,
                model,
                output: answerText ?? '',
                finishReason: chatCompletion.choices[0].finish_reason,
                promptTokens: chatCompletion.usage?.prompt_tokens ?? 0,
                completionTokens: chatCompletion.usage?.completion_tokens ?? 0,
                totalTokens: chatCompletion.usage?.total_tokens ?? 0,
                requestTime: chatCompletion.created,
                durationMs: llmResponseTime - llmRequestTime,
            });

            if(!answerText) {
                console.error(chatCompletion);
                throw new Error('LLM returned an error');
            }

            options.logger.logAction(options.llmCache.getCacheKey(prompt, model), actionType, 'dev', Date.now() - startTime);

            return answerText;
        }
    };
}