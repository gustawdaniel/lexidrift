import {startCliInterface} from "./adapters/io/cli";
import {startApiServer} from "./adapters/io/api";
import {S3Adapter} from "./adapters/storage/s3";
import {StorageAdapter} from "./ports/storage.port";
import {LoggerAdapter} from "./ports/logger.port";
import {InfluxLogger} from "./adapters/logger/influx";

const adapter = process.argv[2] ?? 'api';

function getLogger(): LoggerAdapter {
    return new InfluxLogger();
}

function getStorage(): StorageAdapter {
    return new S3Adapter();
}

async function main() {
    const logger = getLogger();
    const storage = getStorage()

    switch (adapter) {
        case 'api':
            console.log('Starting API server...');
            await startApiServer({storage, logger});
            break;
        case 'cli':
            await startCliInterface({storage, logger})
            break;
        default:
            console.error('Unknown adapter specified:', adapter);
            process.exit(1);
    }
}

main().catch((err) => {
    console.error('Application error:', err);
    process.exit(1);
});