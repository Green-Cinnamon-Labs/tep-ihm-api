import { mkdirSync, writeFileSync } from 'node:fs';
import { z } from 'zod';
import { FrameSchema } from '../src/schema.js';

mkdirSync('schema', { recursive: true });
writeFileSync(
    'schema/frame.schema.json',
    JSON.stringify(z.toJSONSchema(FrameSchema), null, 4) + '\n',
);
