import { once } from 'node:events';
import { expect, test } from 'vitest';
import { buildApp } from '../src/app.js';
import { FrameSchema } from '../src/schema.js';

test('/stream pushes a snapshot', async () => {
    const app = buildApp();
    await app.ready();

    const ws = await app.injectWS('/stream');

    // stream.test.ts
    const [data] = (await once(ws, 'message')) as [Buffer];
    const body = FrameSchema.parse(JSON.parse(data.toString()));

    expect(body.snapshot?.xmeas).toHaveLength(41);
    expect(body.connection).toBe('connected');
    expect(body.snapshot?.xmv).toHaveLength(12);

    ws.terminate();
    await app.close();
});
