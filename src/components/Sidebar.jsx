// src/components/Sidebar.jsx
import React from "react";
import { agentBlocks, nodeTypes } from "../data/blocks";

const Sidebar = () => {
  const handleDragStart = (event, block) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(block));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 p-4 border-r bg-gray-50 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">🧱 Node Library</h2>

      {/* 🧠 AI Agent Blocks */}
      <h3 className="text-md font-medium text-gray-700 mb-2">🤖 AI Agent Blocks</h3>
      <div className="space-y-2 mb-4">
        {agentBlocks.map((block) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block)}
            className="flex items-center gap-3 p-3 bg-white border rounded shadow-sm hover:bg-blue-50 cursor-move transition-all"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div>
              <div className="font-medium">{block.label}</div>
              <div className="text-xs text-gray-500">{block.type}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 🧩 Data Pipeline Blocks */}
      <h3 className="text-md font-medium text-gray-700 mb-2">🔧 Data Pipeline Blocks</h3>
      <div className="space-y-2">
        {nodeTypes.map((block) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block)}
            className="flex items-center gap-3 p-3 bg-white border rounded shadow-sm hover:bg-green-50 cursor-move transition-all"
          >
            {block.icon}
            <div>
              <div className="font-medium">{block.label}</div>
              <div className="text-xs text-gray-500">{block.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
