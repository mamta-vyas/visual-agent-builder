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
import OutputConsole from "../components/OutputConsole";

const Canvas = () => {
  const dispatch = useDispatch();
  const reduxNodes = useSelector((state) => state.builder.nodes);
  const selectedNode = useSelector((state) => state.builder.selectedNode);

  const [nodes, setLocalNodes, onNodesChange] = useNodesState(reduxNodes);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLocalNodes(reduxNodes);
  }, [reduxNodes, setLocalNodes]);

  const detectCycle = (nodes, edges) => {
    const graph = {};
    const visited = {};
    const recStack = {};
    const cycleNodes = new Set();

    nodes.forEach((node) => (graph[node.id] = []));
    edges.forEach(({ source, target }) => {
      graph[source].push(target);
    });

    const dfs = (nodeId) => {
      if (!visited[nodeId]) {
        visited[nodeId] = true;
        recStack[nodeId] = true;

        for (const neighbor of graph[nodeId]) {
          if (!visited[neighbor] && dfs(neighbor)) {
            cycleNodes.add(neighbor);
            cycleNodes.add(nodeId);
            return true;
          } else if (recStack[neighbor]) {
            cycleNodes.add(neighbor);
            cycleNodes.add(nodeId);
            return true;
          }
        }
      }
      recStack[nodeId] = false;
      return false;
    };

    const hasCycle = nodes.some((node) => dfs(node.id));
    return hasCycle ? Array.from(cycleNodes) : null;
  };

  const saveFlow = useCallback((nodesToSave, edgesToSave) => {
    localStorage.setItem("flow-data", JSON.stringify({ nodes: nodesToSave, edges: edgesToSave }));
    dispatch(setNodes(nodesToSave));
    dispatch(setEdges(edgesToSave));
  }, [dispatch]);

  useEffect(() => {
    saveFlow(nodes, edges);
  }, [nodes, edges, saveFlow]);

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

      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.error("Invalid drop data", e);
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${data.type}-${+new Date()}`,
        type: "default",
        position,
        data: { label: data.label, type: data.type, config: data.config },
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
    const cycleNodeIds = detectCycle(nodes, edges);

    const clearedNodes = nodes.map((node) => ({
      ...node,
      style: undefined,
    }));

    setLocalNodes(clearedNodes);

    if (nodes.length === 0) {
      newLogs.push({ type: "error", message: "🚨 No nodes to simulate." });
      setLogs(newLogs);
      return;
    }

    if (cycleNodeIds) {
      newLogs.push({
        type: "error",
        message: "🔁 Cycle detected in flow. Highlighting affected nodes.",
      });

      const updatedNodes = nodes.map((node) =>
        cycleNodeIds.includes(node.id)
          ? {
              ...node,
              style: {
                border: "2px solid red",
                background: "#ffe6e6",
              },
            }
          : node
      );

      setLocalNodes(updatedNodes);
      saveFlow(updatedNodes, edges);
      setLogs(newLogs);

      return;
    }

    // Continue normal simulation
    const updatedNodes = nodes.map((node) => {
      const { label, type, config } = node.data;
      if (!config || Object.keys(config).length === 0) {
        newLogs.push({
          type: "success",
          message: `✅ ${label} (${type}) ran at ${new Date().toLocaleTimeString()}`,
        });
      } else {
        newLogs.push({
          type: "success",
          message: `✅ ${label} (${type}) ran with config: ${JSON.stringify(config)}`,
        });
      }
      return node;
    });

    setLocalNodes(updatedNodes);
    saveFlow(updatedNodes, edges);
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
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Canvas Area */}
      <div className="flex-1 p-4">
        <div
          className="relative w-full h-[75vh] border rounded overflow-hidden"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}  s
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
            className="absolute bottom-4 right-4 border border-red-500 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md"
          >
            Simulate Flow
          </button>
        </div>
      </div>

      {/* Config + Console Panel (full width) */}
      <div className="w-full flex flex-col md:flex-row gap-4 px-4 pb-4">
        {/* Edit Config Panel */}
        <div className="w-full md:w-1/2 bg-white rounded border p-4">
          {selectedNode ? (
            <NodeConfigPanel selectedNode={selectedNode} allNodes={nodes} />
          ) : (
            <p className="text-gray-400 italic">Click on a node to configure its options</p>
          )}
        </div>

        {/* Output Console */}
        <div className="w-full md:w-1/2 bg-black text-green-400 rounded border p-4">
          <OutputConsole logs={logs} onClear={() => setLogs([])} />
        </div>
      </div>
    </div>
  );
};

export default Canvas;
