import {AppError} from "../core/types";

export type LogActionType = 'speak.gtts';
export type LogCacheHitType = 'speak.s3'

export abstract class LoggerAdapter {
    abstract logAction(key: string, type: LogActionType, userKey: string, timeMs: number): void;
    abstract logCacheHit(key: string, type: LogCacheHitType, userKey: string, timeMs: number): void;
    abstract logError(key: string, error: AppError, userKey: string, timeMs: number): void
    abstract logProblem(key: string, problem: AppError, userKey: string, timeMs: number): void;
}
