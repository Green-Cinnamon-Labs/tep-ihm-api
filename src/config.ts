import { z } from 'zod';

const schema = z.object({
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    HOST: z.string().default('localhost'),
    OPCUA_ENDPOINT: z.string().default('opc.tcp://127.0.0.1:4840/tep/server/'),
    STREAM_INTERVAL_MS: z.coerce.number().int().min(1).default(500),
    CSV_REPLAY: z.string().optional(),
    LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
        .default('info'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    console.error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
    process.exit(1);
}

export const config = parsed.data;
