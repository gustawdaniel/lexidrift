import {AppError} from "../core/types";


export type LogActionType = 'imagify';
export type LogCacheHitType = 'imagify.s3';

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
