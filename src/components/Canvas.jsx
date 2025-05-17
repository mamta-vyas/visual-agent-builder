import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  setNodes,
  setEdges,
  selectNode,
} from "../redux/builderSlice";

import NodeConfigPanel from "../components/NodeConfigPanel";
import OutputConsole from "./OutputConsole";

const Canvas = () => {
  const dispatch = useDispatch();
  const reduxNodes = useSelector((state) => state.builder.nodes);
  const selectedNode = useSelector((state) => state.builder.selectedNode);

  const [nodes, setLocalNodes, onNodesChange] = useNodesState(reduxNodes);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState([]);
  const [logs, setLogs] = useState([]);

  const detectCycle = (nodes, edges) => {
    const graph = {};
    nodes.forEach((node) => (graph[node.id] = []));
    edges.forEach(({ source, target }) => {
      graph[source].push(target);
    });

    const visited = {};
    const recStack = {};

    const dfs = (nodeId) => {
      if (!visited[nodeId]) {
        visited[nodeId] = true;
        recStack[nodeId] = true;

        for (const neighbor of graph[nodeId]) {
          if (!visited[neighbor] && dfs(neighbor)) {
            return true;
          } else if (recStack[neighbor]) {
            return true;
          }
        }
      }
      recStack[nodeId] = false;
      return false;
    };

    return nodes.some((node) => dfs(node.id));
  };

  const saveFlow = useCallback((nodesToSave, edgesToSave) => {
    localStorage.setItem("flow-data", JSON.stringify({ nodes: nodesToSave, edges: edgesToSave }));
    dispatch(setNodes(nodesToSave));
    dispatch(setEdges(edgesToSave));
  }, [dispatch]);

  const onConnect = useCallback(
    (params) => {
      const updatedEdges = addEdge(params, edges);
      setLocalEdges(updatedEdges);
      saveFlow(nodes, updatedEdges);
    },
    [edges, nodes, saveFlow, setLocalEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const data = JSON.parse(event.dataTransfer.getData("application/reactflow"));
      if (!data) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${data.type}-${+new Date()}`,
        type: "default",
        position,
        data: {
          label: data.label,
          config: data.config || {},
          type: data.type,
        },
      };

      const updatedNodes = [...nodes, newNode];
      setLocalNodes(updatedNodes);
      saveFlow(updatedNodes, edges);
    },
    [nodes, edges, saveFlow, setLocalNodes]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onNodeClick = (event, node) => {
    dispatch(selectNode(node));
  };

  const simulateFlow = () => {
    const newLogs = [];

    if (nodes.length === 0) {
      newLogs.push({ type: "error", message: "🚨 No nodes to simulate." });
      setLogs(newLogs);
      return;
    }

    const hasCycle = detectCycle(nodes, edges);
    if (hasCycle) {
      newLogs.push({ type: "error", message: "🔁 Cycle detected in flow. Simulation aborted." });
      setLogs(newLogs);
      return;
    }

    nodes.forEach((node) => {
      const { label, type, config } = node.data;
      if (!config || Object.keys(config).length === 0) {
        newLogs.push({
          type: "error",
          message: `⚠️ ${label} (${type}) is missing config.`,
        });
      } else {
        newLogs.push({
          type: "success",
          message: `✅ ${label} (${type}) ran with config: ${JSON.stringify(config)}`,
        });
      }
    });

    setLogs(newLogs);
  };

  useEffect(() => {
    const saved = localStorage.getItem("flow-data");
    if (saved) {
      const { nodes, edges } = JSON.parse(saved);
      setLocalNodes(nodes);
      setLocalEdges(edges);
      dispatch(setNodes(nodes));
      dispatch(setEdges(edges));
    }
  }, [dispatch, setLocalNodes, setLocalEdges]);

  return (
    <div className="w-3/4 h-full p-4">
      <div className="h-[80vh] border rounded overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            onNodesChange(changes);
            const updated = changes.reduce((acc, change) => {
              const node = nodes.find((n) => n.id === change.id);
              if (node) {
                acc.push({ ...node, ...change });
              }
              return acc;
            }, []);
            saveFlow(updated, edges);
          }}
          onEdgesChange={(changes) => {
            onEdgesChange(changes);
            saveFlow(nodes, edges);
          }}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>

        <button
          onClick={simulateFlow}
          className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md"
        >
          Simulate Flow
        </button>
      </div>

      <OutputConsole logs={logs} onClear={() => setLogs([])} />
      <NodeConfigPanel selectedNode={selectedNode} allNodes={nodes} />
    </div>
  );
};

export default Canvas;
