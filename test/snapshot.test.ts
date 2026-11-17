import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { FrameSchema } from '../src/schema.js';

describe('GET /snapshot', () => {
    it('answers ok', async () => {
        const app = buildApp();
        const res = await app.inject({ method: 'GET', url: '/snapshot' });
        expect(res.statusCode).toBe(200);
        // snapshot.test.ts
        const body = FrameSchema.parse(res.json());
        expect(body.connection).toBe('connected');
        expect(body.snapshot?.xmeas).toHaveLength(41);
        expect(body.snapshot?.xmv).toHaveLength(12);
        expect(body.snapshot?.shutdown).toBe(false);
    });
});
