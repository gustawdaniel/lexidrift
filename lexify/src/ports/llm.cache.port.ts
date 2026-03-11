export interface LLMCacheRecord {
    md5: string;// TEXT PRIMARY KEY,
    input: string;// TEXT NOT NULL,
    model: string;// TEXT NOT NULL,
    output: string;// TEXT NOT NULL,
    finishReason: string;// TEXT NOT NULL,
    promptTokens: number;// INTEGER NOT NULL,
    completionTokens: number;// INTEGER NOT NULL,
    totalTokens: number;// INTEGER NOT NULL,
    requestTime: number;// INTEGER NOT NULL,
    durationMs: number;// INTEGER NOT NULL
}

export interface LLMCacheAdapter {
    getCacheKey(prompt: string, model: string): string;
    get(prompt: string, model: string): Promise<LLMCacheRecord | null>;
    set(record: Omit<LLMCacheRecord, 'md5'>): Promise<void>;
}