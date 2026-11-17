import Fastify, { type FastifyServerOptions } from 'fastify';
import websocket from '@fastify/websocket';
import type { Frame } from './plant.js';

const MAX_BUFFERED = 64 * 1024;

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
    intervalMs = 500,
) {
    const app = Fastify(opts);
    const alive = new WeakSet<object>();

    const timer = setInterval(async () => {
        const msg = JSON.stringify(await source());

        // TODO: temp
        const worst = Math.max(
            0,
            ...[...app.websocketServer.clients].map((c) => c.bufferedAmount),
        );
        if (Date.now() % 1000 < intervalMs)
            console.log('bufferedAmount', worst);

        for (const client of app.websocketServer.clients) {
            if (client.bufferedAmount > MAX_BUFFERED) continue;
            client.send(msg);
        }
    }, intervalMs);

    const heartbeat = setInterval(() => {
        for (const client of app.websocketServer.clients) {
            if (!alive.has(client)) {
                client.terminate();
                continue;
            }
            alive.delete(client);
            client.ping();
        }
    }, 30_000);

    app.get('/healthz', () => ({ status: 'ok' }));

    app.get('/snapshot', () => source());

    app.register(websocket);

    app.register(async (instance) => {
        instance.get('/stream', { websocket: true }, (socket) => {
            alive.add(socket);
            socket.on('pong', () => alive.add(socket));
        });
    });

    app.addHook('onClose', async () => {
        clearInterval(timer);
        clearInterval(heartbeat);
    });

    return app;
}
