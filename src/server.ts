import { buildApp } from './app.js';
import { config } from './config.js';
import { createPlant } from './plant.js';

const source = createPlant(config.OPCUA_ENDPOINT);

const app = buildApp(
    { logger: { level: config.LOG_LEVEL } },
    source,
    config.STREAM_INTERVAL_MS,
);

await app.listen({ port: config.PORT, host: config.HOST });
