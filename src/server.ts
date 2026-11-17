import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/healthz', async () => ({ status: 'ok' }));

await app.listen({ port: 3000 });
