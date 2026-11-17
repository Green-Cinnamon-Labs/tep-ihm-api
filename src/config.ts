import { z } from 'zod';

const schema = z.object({
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    HOST: z.string().default('localhost'),
    LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
        .default('info'),

    OPCUA_ENDPOINT: z.string().default('opc.tcp://127.0.0.1:4840/tep/server/'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    console.error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
    process.exit(1);
}

export const config = parsed.data;
