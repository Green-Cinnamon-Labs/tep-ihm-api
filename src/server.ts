import { buildApp } from './app.js';
import { config } from './config.js';
import { connectPlant } from './plant.js';

const source = await connectPlant(config.OPCUA_ENDPOINT);
const app = buildApp({ logger: { level: config.LOG_LEVEL } }, source);

await app.listen({ port: config.PORT, host: config.HOST });
