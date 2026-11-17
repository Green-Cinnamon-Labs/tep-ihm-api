import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { z } from 'zod';
import { buildApp } from '../src/app.js';
import { FrameSchema } from '../src/schema.js';

test('the committed JSON Schema matches FrameSchema', () => {
    const file: unknown = JSON.parse(
        readFileSync('schema/frame.schema.json', 'utf8'),
    );
    expect(file).toEqual(z.toJSONSchema(FrameSchema));
});

test('/snapshot answers a valid frame', async () => {
    const app = buildApp();
    const res = await app.inject({ url: '/snapshot' });
    expect(FrameSchema.safeParse(res.json()).success).toBe(true);
});
