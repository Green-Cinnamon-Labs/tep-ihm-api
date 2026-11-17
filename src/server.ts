import { buildApp } from './app.js';
import { config } from './config.js';
import { createPlant } from './plant.js';
import { createReplay } from './replay.js';

const source = config.CSV_REPLAY
    ? createReplay(config.CSV_REPLAY, config.STREAM_INTERVAL_MS)
    : createPlant(config.OPCUA_ENDPOINT);

const app = buildApp(
    { logger: { level: config.LOG_LEVEL } },
    source,
    config.STREAM_INTERVAL_MS,
);

await app.listen({ port: config.PORT, host: config.HOST });
