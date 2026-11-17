import { once } from 'node:events';
import { expect, test } from 'vitest';
import { buildApp } from '../src/app.js';

test('/stream pushes a snapshot', async () => {
    const app = buildApp();
    await app.ready();

    const ws = await app.injectWS('/stream');
    const [data] = await once(ws, 'message');
    const body = JSON.parse(data.toString());

    expect(body.snapshot.xmeas).toHaveLength(41);
    expect(body.connection).toBe('connected');
    expect(body.snapshot.xmv).toHaveLength(12);

    ws.terminate();
    await app.close();
});
