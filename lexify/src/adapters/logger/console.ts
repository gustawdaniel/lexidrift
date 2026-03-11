import {LogActionType, LogCacheHitType, LoggerAdapter} from "../../ports/logger.port";
import {AppError} from "../../core/types";

export class ConsoleLogger extends LoggerAdapter {
    logAction(key: string, type: LogActionType, _userKey: string, time: number): void {
        console.log(`Logging ${type} of: ${key}`, {time});
    }

    logCacheHit(key: string, type: LogCacheHitType, _userKey: string, time: number): void {
        console.log(`Logging ${type} cache hit of: ${key}`, {time});
    }

    logError(key: string, error: AppError, userKey: string, time: number): void {
        console.error(`Logging error of: ${key}`, {userKey, time, error});
    }

    logProblem(key: string, problem: AppError, userKey: string, time: number): void {
        console.error(`Logging problem of: ${key}`, {userKey, time, problem});
    }
}
