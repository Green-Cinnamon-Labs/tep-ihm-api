import { AttributeIds, OPCUAClient } from 'node-opcua';
import { SHUTDOWN_NODE, XMEAS_NODES, XMV_NODES } from './signals.js';

export async function connectPlant(endpoint: string) {
  
    const client = OPCUAClient.create({
    endpointMustExist: false,
    connectionStrategy: { maxRetry: 0 },
  });
  await client.connect(endpoint);
  const session = await client.createSession();

  const root = await session.browse('ObjectsFolder');
  const folder = root.references?.find((r) => r.browseName.name === 'Signals');
  if (!folder) throw new Error('Signals folder not found');

  const children = await session.browse(folder.nodeId.toString());
  const byName = new Map(children.references?.map((r) => [r.browseName.name, r.nodeId]));
  const ids = [...XMEAS_NODES, ...XMV_NODES, SHUTDOWN_NODE].map((name) => {
    const id = byName.get(name);
    if (!id) throw new Error(`missing node: ${name}`);
    return id;
  });

  return async () => {
    const results = await session.read(ids.map((nodeId) => ({ nodeId, attributeId: AttributeIds.Value })));
    const v = results.map((r) => r.value.value);
    return {
      simTime: null,
      xmeas: v.slice(0, 41).map(Number),
      xmv: v.slice(41, 53).map(Number),
      shutdown: Boolean(v[53]),
    };
  };
}
