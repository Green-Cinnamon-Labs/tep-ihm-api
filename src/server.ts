import Fastify from 'fastify';
import { config } from './config.js';

const app = Fastify({ logger: { level: config.LOG_LEVEL } })

app.get('/healthz', async () => ({ status: 'ok' }));

app.listen({ port: config.PORT, host: config.HOST })