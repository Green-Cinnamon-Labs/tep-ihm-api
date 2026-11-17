import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, test, vi } from 'vitest';
import { createReplay } from '../src/replay.js';
import { FrameSchema } from '../src/schema.js';

function writeCsv(rows: number, header?: string) {
    const names = [
        't_h',
        ...Array.from({ length: 41 }, (_, i) => `xmeas_${i + 1}`),
        ...Array.from({ length: 12 }, (_, i) => `xmv_${i + 1}`),
    ];
    const lines = Array.from({ length: rows }, (_, r) =>
        [r, ...Array.from({ length: 53 }, () => r)].join(','),
    );
    const path = join(mkdtempSync(join(tmpdir(), 'replay-')), 'rec.csv');
    writeFileSync(path, [header ?? names.join(','), ...lines].join('\n'));
    return path;
}

afterEach(() => vi.useRealTimers());

test('replays the rows in order and loops', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const source = createReplay(writeCsv(3), 100);

    expect(FrameSchema.parse(source()).snapshot?.simTime).toBe(0);
    vi.setSystemTime(100);
    expect(source().snapshot?.simTime).toBe(1);
    vi.setSystemTime(300);
    expect(source().snapshot?.simTime).toBe(0);
});

test('fails at startup when a column is missing', () => {
    expect(() => createReplay(writeCsv(2, 't_h,xmeas_1'), 100)).toThrow(
        'missing column',
    );
});
