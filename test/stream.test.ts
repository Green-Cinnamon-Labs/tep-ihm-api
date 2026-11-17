import { once } from 'node:events';
import { expect, test } from 'vitest';
import { buildApp } from '../src/app.js';

test('/stream pushes a snapshot', async () => {
  const app = buildApp();
  await app.ready();

  const ws = await app.injectWS('/stream');
  const [data] = await once(ws, 'message');
  const body = JSON.parse(data.toString());

  expect(body.xmeas).toHaveLength(41);
  expect(body.xmv).toHaveLength(12);

  ws.terminate();
  await app.close();
});
