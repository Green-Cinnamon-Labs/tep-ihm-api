import Fastify, { type FastifyServerOptions } from 'fastify';

export function buildApp(opts: FastifyServerOptions = {}) {
  const app = Fastify(opts);

  app.get('/healthz', () => ({ status: 'ok' }));

  app.get('/snapshot', () => ({
    simTime: Date.now() / 1000,
    xmeas: Array.from({ length: 41 }, () => Math.random()),
    xmv: Array.from({ length: 12 }, () => Math.random()),
    shutdown: false,
  }));

  return app;
}
