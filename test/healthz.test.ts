import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('GET /healthz', () => {
  it('answers ok', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/healthz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('ignores the query string', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/healthz?probe=1' });
    expect(res.statusCode).toBe(200);
  });
});
