import Fastify, { type FastifyServerOptions } from 'fastify';
import websocket from '@fastify/websocket';
import type { Frame } from './plant.js';

function fakeSource(): Frame {
    return {
        connection: 'connected',
        snapshot: {
            simTime: Date.now() / 1000,
            xmeas: Array.from({ length: 41 }, () => Math.random()),
            xmv: Array.from({ length: 12 }, () => Math.random()),
            shutdown: false,
        },
    };
}

export function buildApp(
    opts: FastifyServerOptions = {},
    source: () => Frame | Promise<Frame> = fakeSource,
) {
    const app = Fastify(opts);

    const timer = setInterval(async () => {
        const msg = JSON.stringify(await source());
        for (const client of app.websocketServer.clients) client.send(msg);
    }, 500);

    app.get('/healthz', () => ({ status: 'ok' }));

    app.get('/snapshot', () => source());

    app.register(websocket);

    app.register(async (instance) => {
        instance.get('/stream', { websocket: true }, () => {});
    });

    app.addHook('onClose', async () => clearInterval(timer));

    return app;
}
