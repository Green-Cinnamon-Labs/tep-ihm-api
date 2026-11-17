import { buildApp } from './app.js';
import { config } from './config.js';

const app = buildApp({ logger: { level: config.LOG_LEVEL } });

await app.listen({ port: config.PORT, host: config.HOST });
