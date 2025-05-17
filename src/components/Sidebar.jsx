import React from "react";
import { FaDatabase, FaFilter, FaCogs } from "react-icons/fa";

const nodeTypes = [
  {
    label: "Source",
    icon: <FaDatabase />,
    type: "source",
    config: {
      endpoint: "https://api.example.com/data", // default value
    },
  },
  {
    label: "Filter",
    icon: <FaFilter />,
    type: "filter",
    config: {
      condition: "item.value > 10", // default value
    },
  },
  {
    label: "Processor",
    icon: <FaCogs />,
    type: "processor",
    config: {
      threads: 2, // default value
    },
  },
];

const Sidebar = () => {
  const handleDragStart = (event, block) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(block));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-1/4 p-4 border-r bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">⚙️ Node Blocks</h2>

      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => handleDragStart(e, node)}
            className="flex items-center gap-3 p-3 bg-white border rounded shadow-sm hover:bg-blue-50 cursor-move transition-all"
          >
            {node.icon}
            <div>
              <div className="font-medium">{node.label}</div>
              <div className="text-xs text-gray-500">{node.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
