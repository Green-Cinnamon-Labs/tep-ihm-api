import Fastify, { type FastifyServerOptions } from 'fastify';

export function buildApp(opts: FastifyServerOptions = {}) {
  const app = Fastify(opts);

  app.get('/healthz', () => ({ status: 'ok' }));

  return app;
}
