import {LogActionType, LogCacheHitType, LoggerAdapter} from "../../ports/logger.port";
import {InfluxDB, Point, WriteApi} from '@influxdata/influxdb-client'
import {config} from "../../core/config";
import assert from "node:assert/strict";
import {AppError} from "../../core/types";

export class InfluxLogger extends LoggerAdapter {
    private writeApi: WriteApi;

    close(): Promise<void> {
        return this.writeApi.close();
    }

    constructor() {
        super();

        const {token, url, org, bucket} = config.influx;

        assert.ok(token, "INFLUX_TOKEN is required");
        assert.ok(url, "INFLUX_URL is required");
        assert.ok(org, "INFLUX_ORG_ID is required");
        assert.ok(bucket, "INFLUX_BUCKET is required");

        this.writeApi = new InfluxDB({url, token}).getWriteApi(org, bucket, 'ns')
    }

    logAction(key: string, type: LogActionType, userKey: string, timeMs: number) {
        console.log(`Logging ${type} to InfluxDB: ${key}`);

        const point = new Point('action')
            .tag('env', config.env)
            .tag('type', type)
            .stringField('key', key)
            .intField('time_taken_ms', timeMs)
            .stringField('user_key', userKey)
            .timestamp(new Date());

        this.writeApi.writePoint(point)
    }

    logCacheHit(key: string, type: LogCacheHitType, userKey: string, timeMs: number) {
        console.log(`Logging cache hit to InfluxDB: ${key}`);

        const point = new Point('cache')
            .tag('env', config.env)
            .tag('type', type)
            .stringField('key', key)
            .intField('time_taken_ms', timeMs)
            .stringField('user_key', userKey)
            .timestamp(new Date());

        this.writeApi.writePoint(point)
    }

    logError(key: string, error: AppError, userKey: string, timeMs: number) {
        console.error(`Logging error to InfluxDB: ${key}`);

        const point = new Point('error')
            .tag('env', config.env)
            .stringField('key', key)
            .intField('time_taken_ms', timeMs)
            .stringField('user_key', userKey)
            .stringField('message', error.message)
            .intField('status', error.status)
            .timestamp(new Date());

        this.writeApi.writePoint(point)
    }

    logProblem(key: string, problem: AppError, userKey: string, timeMs: number) {
        console.error(`Logging problem to InfluxDB: ${key}`);
        const point = new Point('problem')
            .tag('env', config.env)
            .stringField('key', key)
            .intField('time_taken_ms', timeMs)
            .stringField('user_key', userKey)
            .stringField('message', problem.message)
            .intField('status', problem.status)
            .timestamp(new Date());
        this.writeApi.writePoint(point)
    }
}
