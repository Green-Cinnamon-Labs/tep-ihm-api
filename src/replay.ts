import { readFileSync } from 'node:fs';
import { type Frame, SnapshotSchema } from './schema.js';

export function createReplay(path: string, rowMs: number) {
    const [header, ...lines] = readFileSync(path, 'utf8').trim().split(/\r?\n/);
    if (!header || lines.length === 0) {
        throw new Error(`empty replay file: ${path}`);
    }
    const columns = header.split(',');
    const at = (name: string) => {
        const i = columns.indexOf(name);
        if (i < 0) throw new Error(`missing column: ${name}`);
        return i;
    };
    const timeAt = at('t_h');
    const xmeasAt = Array.from({ length: 41 }, (_, i) => at(`xmeas_${i + 1}`));
    const xmvAt = Array.from({ length: 12 }, (_, i) => at(`xmv_${i + 1}`));

    const frames: Frame[] = lines.map((line) => {
        const cells = line.split(',');
        return {
            connection: 'connected',
            snapshot: SnapshotSchema.parse({
                simTime: Number(cells[timeAt]),
                xmeas: xmeasAt.map((i) => Number(cells[i])),
                xmv: xmvAt.map((i) => Number(cells[i])),
                shutdown: false,
            }),
        };
    });

    const start = Date.now();
    return (): Frame =>
        frames[Math.floor((Date.now() - start) / rowMs) % frames.length];
}
