import {LogActionType, LogCacheHitType, LoggerAdapter} from "../../ports/logger.port";
import {AppError} from "../../core/types";

export class SilentLogger extends LoggerAdapter {
    logAction(_key: string, _type: LogActionType, _userKey: string, _time: number): void {
    }

    logCacheHit(_key: string, _type: LogCacheHitType, _userKey: string, _time: number): void {
    }

    logError(_key: string, _error: AppError, _userKey: string, _time: number): void {
    }

    logProblem(_key: string, _problem: AppError, _userKey: string, _time: number): void {
    }
}