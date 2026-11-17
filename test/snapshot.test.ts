import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('GET /snapshot', () => {
  it('answers ok', async () => {
    const app = buildApp();
    const res = await app.inject({ method: 'GET', url: '/snapshot' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.xmeas).toHaveLength(41);
    expect(body.xmv).toHaveLength(12);
    expect(body.shutdown).toBe(false);
  });

});
