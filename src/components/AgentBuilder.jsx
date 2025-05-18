import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nanoid } from 'nanoid';

// === Node Types ===
const nodeTypes = {
  llmNode: ({ data }) => (
    <div className="bg-blue-100 border-2 border-blue-500 text-blue-900 rounded-md p-2 text-sm w-40">
      <strong>LLM:</strong> {data.label}
    </div>
  ),
  memoryNode: ({ data }) => (
    <div className="bg-green-100 border-2 border-green-500 text-green-900 rounded-md p-2 text-sm w-40">
      <strong>Memory:</strong> {data.label}
    </div>
  ),
  toolNode: ({ data }) => (
    <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-900 rounded-md p-2 text-sm w-40">
      <strong>Tool:</strong> {data.label}
    </div>
  ),
};

// === Cycle Detection Utility ===
const detectCycle = (nodes, edges) => {
  const graph = {};
  nodes.forEach((node) => (graph[node.id] = []));
  edges.forEach((edge) => {
    graph[edge.source].push(edge.target);
  });

  const visited = new Set();
  const stack = new Set();
  const cycleNodes = [];

  const dfs = (nodeId) => {
    if (stack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    stack.add(nodeId);

    for (const neighbor of graph[nodeId]) {
      if (dfs(neighbor)) {
        cycleNodes.push(nodeId);
        return true;
      }
    }

    stack.delete(nodeId);
    return false;
  };

  for (const nodeId of Object.keys(graph)) {
    if (dfs(nodeId)) break;
  }

  return cycleNodes;
};

// === Main Component ===
const AgentBuilder = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [logs, setLogs] = useState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance || !reactFlowWrapper.current) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
        y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
      });

      const newNode = {
        id: nanoid(),
        type,
        position,
        data: { label: `${type.replace('Node', '')} Node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const simulateFlow = () => {
    const newLogs = [];
    const cycleNodeIds = detectCycle(nodes, edges);

    if (nodes.length === 0) {
      newLogs.push({ type: 'error', message: '🚨 No nodes to simulate.' });
      setLogs(newLogs);
      return;
    }

    if (cycleNodeIds.length > 0) {
      newLogs.push({ type: 'error', message: '🔁 Cycle detected! Simulation halted.' });
      setLogs(newLogs);
      return;
    }

    newLogs.push({ type: 'info', message: '✅ Simulation started...' });

    nodes.forEach((node, index) => {
      newLogs.push({ type: 'info', message: `▶️ Executing node ${index + 1}: ${node.data.label}` });
    });

    newLogs.push({ type: 'success', message: '🏁 Simulation complete!' });
    setLogs(newLogs);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 p-4 bg-gray-100 border-r border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Components</h2>
        {['llmNode', 'memoryNode', 'toolNode'].map((type) => (
          <div
            key={type}
            className="cursor-move bg-white border p-2 mb-2 rounded shadow text-center"
            onDragStart={(event) =>
              event.dataTransfer.setData('application/reactflow', type)
            }
            draggable
          >
            {type.replace('Node', '')}
          </div>
        ))}
      </aside>

      {/* Canvas + Console */}
      <div className="flex-1 flex flex-col" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={(changes) =>
                setNodes((nds) => applyNodeChanges(changes, nds))
              }
              onEdgesChange={(changes) =>
                setEdges((eds) => applyEdgeChanges(changes, eds))
              }
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              nodeTypes={nodeTypes}
            >
              <MiniMap />
              <Controls />
              <Background gap={12} size={1} />
            </ReactFlow>
          </div>

          {/* Footer Controls */}
          <div className="bg-gray-100 p-2 border-t flex justify-end">
            <button
              onClick={simulateFlow}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Run Simulation
            </button>
          </div>

          {/* Simulation Console */}
          <div className="h-48 bg-black text-white text-sm overflow-y-auto p-2">
            {logs.map((log, idx) => (
              <div key={idx} className={
                log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-green-400' :
                'text-white'
              }>
                {log.message}
              </div>
            ))}
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default AgentBuilder;
