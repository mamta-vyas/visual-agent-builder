import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNodes } from "../redux/builderSlice";

const NodeConfigPanel = ({ selectedNode, allNodes }) => {
  const dispatch = useDispatch();
  const [config, setConfig] = useState({});

  useEffect(() => {
    console.log("Selected Node:", selectedNode);
    if (selectedNode?.data?.config && typeof selectedNode.data.config === "object") {
      setConfig(selectedNode.data.config);
    } else {
      setConfig({});
    }
  }, [selectedNode]);

  const handleChange = (key, value) => {
    let parsedValue = value;
    if (!isNaN(config[key]) && !isNaN(Number(value))) {
      parsedValue = Number(value);
    }

    const newConfig = { ...config, [key]: parsedValue };
    setConfig(newConfig);

    const updatedNodes = allNodes.map((node) =>
      node.id === selectedNode.id
        ? {
            ...node,
            data: {
              ...node.data,
              config: newConfig,
            },
          }
        : node
    );

    dispatch(setNodes(updatedNodes));
    localStorage.setItem("flow-data", JSON.stringify({ nodes: updatedNodes }));
  };

  if (!selectedNode || !selectedNode.data || !selectedNode.data.label) {
    return <p className="text-gray-500">Click a node to edit its config</p>;
  }

  return (
    <div className="p-4 border rounded bg-white shadow w-full">
      <h2 className="font-bold text-lg mb-2">
        ⚙️ Edit Config: {selectedNode.data.label || "Unnamed Node"}
      </h2>

      {Object.entries(config).length === 0 && (
        <p className="text-gray-500 italic">No config to edit for this node.</p>
      )}

      {Object.entries(config).map(([key, value]) => (
        <div key={key} className="mb-3">
          <label className="block font-medium text-sm mb-1 capitalize">{key}</label>
          <input
            type={typeof value === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default NodeConfigPanel;
