import {AppError} from "../core/types";


export type LogActionType = 'define' | 'check' | 'answer.check';
export type LogCacheHitType = 'define.mongo' | 'check.mongo' | 'define.turso' | 'check.turso'

export abstract class LoggerAdapter {
    abstract logAction(key: string, type: LogActionType, userKey: string, time: number): void;

    abstract logCacheHit(key: string, type: LogCacheHitType, userKey: string, time: number): void;

    abstract logError(
        key: string,
        error: AppError,
        userKey: string,
        time: number,
    ): void;

    abstract logProblem(
        key: string,
        problem: AppError,
        userKey: string,
        time: number,
    ): void;
}
