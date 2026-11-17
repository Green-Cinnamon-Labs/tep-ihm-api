import { z } from 'zod';

export const SnapshotSchema = z.object({
    simTime: z.number().nullable(),
    xmeas: z.array(z.number()).length(41),
    xmv: z.array(z.number()).length(12),
    shutdown: z.boolean(),
});

export const FrameSchema = z.object({
    connection: z.enum(['connected', 'reconnecting']),
    snapshot: SnapshotSchema.nullable(),
});

export type Snapshot = z.infer<typeof SnapshotSchema>;
export type Frame = z.infer<typeof FrameSchema>;
