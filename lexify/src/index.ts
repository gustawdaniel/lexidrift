import {closeMongoStorage} from './adapters/db/mongo';
import {initDefinitionMongoStorage} from './adapters/models/definition/mongo';
import {initWordMongoStorage} from './adapters/models/word/mongo';
import {createLlmOpenApiClient} from './adapters/llm/open_ai';
import {createLlmStaticClient} from './adapters/llm/static';
import {startApiServer} from './adapters/io/api';
import {startCliInterface} from './adapters/io/cli';
// import { startNatsListener } from './adapters/io/nats';
import {config} from "./core/config";
import {LLMAdapter} from "./ports/llm.port";
import {createLlmTursoCacheClient} from "./adapters/llm/cache/turso";
import {LoggerAdapter} from "./ports/logger.port";
import {SilentLogger} from "./adapters/logger/silent";
import {ConsoleLogger} from "./adapters/logger/console";
import {InfluxLogger} from "./adapters/logger/influx";

// Load configuration (could use dotenv or similar library)
const adapter = process.argv[2] ?? 'api';

function getLogger(): LoggerAdapter {
    switch (config.env) {
        case 'test':
        case 'e2e':
            return new SilentLogger();
        case 'development':
            return new ConsoleLogger();
        case 'production':
            return new InfluxLogger();
        default:
            throw new Error(`Unknown env: ${config.env}`);
    }
}

function getLLM(options: { logger: LoggerAdapter }): LLMAdapter {
    console.log(config.env);

    if (config.env === 'test' || config.env === 'e2e') {
        return createLlmStaticClient();
    } else {
        if (!config.openaiApiKey) {
            throw new Error('OPENAI_API_KEY is required');
        }
        const llmCache = createLlmTursoCacheClient();
        return createLlmOpenApiClient(config.openaiApiKey, {llmCache, logger: options.logger});
    }
}

// Decide which adapter to run
async function main() {
    const definitionStorage = await initDefinitionMongoStorage();
    const wordStorage = await initWordMongoStorage();
    const logger = getLogger();
    const llmClient = getLLM({logger});

    switch (adapter) {
        case 'api':
            console.log('Starting API server...');
            await startApiServer({wordStorage, definitionStorage, llmClient, logger});
            break;
        case 'cli':
            await startCliInterface({wordStorage, definitionStorage, llmClient, logger});
            await closeMongoStorage();
            break;
        // case 'nats':
        //     console.log('Starting NATS listener...');
        //     await startNatsListener({ definitionStorage, llmClient });
        //     break;
        default:
            console.error('Unknown adapter specified:', adapter);
            process.exit(1);
    }
}

main().catch((err) => {
    console.error('Application error:', err);
    process.exit(1);
});