import Fastify, { type FastifyServerOptions } from 'fastify';
import websocket from '@fastify/websocket'


export function buildApp(opts: FastifyServerOptions = {}) {
  
  
  const app = Fastify(opts);
  const timer = setInterval(() => {
    const msg = JSON.stringify(makeSnapshot());
    for (const client of app.websocketServer.clients) client.send(msg);
  }, 500);


  function makeSnapshot() {
    return {
      simTime: Date.now() / 1000,
      xmeas: Array.from({ length: 41 }, () => Math.random()),
      xmv: Array.from({ length: 12 }, () => Math.random()),
      shutdown: false,
    };
  }

  app.get('/healthz', () => ({ status: 'ok' }));

  app.get('/snapshot', makeSnapshot);

  app.register(websocket);

  app.register(async (instance) => {
    instance.get('/stream', { websocket: true }, () => {});
  });

  app.addHook('onClose', async () => clearInterval(timer));

  return app;
}
