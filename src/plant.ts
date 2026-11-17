import { AttributeIds, OPCUAClient } from 'node-opcua';
import { SHUTDOWN_NODE, XMEAS_NODES, XMV_NODES } from './signals.js';
import { type Frame, type Snapshot, SnapshotSchema } from './schema.js';

export async function connectPlant(endpoint: string) {
    const client = OPCUAClient.create({
        endpointMustExist: false,
        connectionStrategy: { maxRetry: 0 },
    });

    await client.connect(endpoint);

    try {
        const session = await client.createSession();

        const root = await session.browse('ObjectsFolder');
        const folder = root.references?.find(
            (r) => r.browseName.name === 'Signals',
        );
        if (!folder) throw new Error('Signals folder not found');

        const children = await session.browse(folder.nodeId.toString());
        const byName = new Map(
            children.references?.map((r) => [r.browseName.name, r.nodeId]),
        );
        const ids = [...XMEAS_NODES, ...XMV_NODES, SHUTDOWN_NODE].map(
            (name) => {
                const id = byName.get(name);
                if (!id) throw new Error(`missing node: ${name}`);
                return id;
            },
        );

        return {
            read: async (): Promise<Snapshot> => {
                const results = await session.read(
                    ids.map((nodeId) => ({
                        nodeId,
                        attributeId: AttributeIds.Value,
                    })),
                );
                const v = results.map((r) => r.value.value as unknown);
                return SnapshotSchema.parse({
                    simTime: null,
                    xmeas: v.slice(0, 41),
                    xmv: v.slice(41, 53),
                    shutdown: Boolean(v[53]),
                });
            },
            close: async () => {
                await session.close();
                await client.disconnect();
            },
        };
    } catch (err) {
        await client.disconnect().catch(() => {});
        throw err;
    }
}

export function createPlant(endpoint: string) {
    let conn: Awaited<ReturnType<typeof connectPlant>> | null = null;
    let connecting = false;

    async function connect() {
        if (connecting) return;
        connecting = true;
        let delay = 500;
        while (!conn) {
            try {
                conn = await connectPlant(endpoint);
            } catch (err) {
                console.warn(
                    `plant unavailable (${String(err)}), retrying in ${delay} ms`,
                );
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay = Math.min(delay * 2, 10_000);
            }
        }
        connecting = false;
    }

    void connect();

    return async (): Promise<Frame> => {
        const current = conn;
        if (!current) return { connection: 'reconnecting', snapshot: null };
        try {
            return { connection: 'connected', snapshot: await current.read() };
        } catch (err) {
            console.warn(`plant read failed: ${String(err)}`);
            if (conn === current) {
                conn = null;
                void current.close().catch(() => {});
                void connect();
            }
            return { connection: 'reconnecting', snapshot: null };
        }
    };
}
