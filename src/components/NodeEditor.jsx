import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateNodeConfig } from "../redux/builderSlice";

const NodeEditor = () => {
  const selectedNode = useSelector((state) => state.builder.selectedNode);
  const dispatch = useDispatch();

  if (!selectedNode) return null;

  const { id, data } = selectedNode;
  const { label, config } = data;

  const handleChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    dispatch(updateNodeConfig({ id, config: newConfig }));
  };

  return (
    <div className="absolute top-4 right-4 w-64 bg-white border shadow-lg rounded p-4 z-50">
      <h2 className="font-semibold text-lg mb-2">Editing: {label}</h2>
      {Object.keys(config).length === 0 ? (
        <p className="text-sm text-gray-500">No config options</p>
      ) : (
        <form className="space-y-3">
          {Object.entries(config).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700">{key}</label>
              <input
                className="w-full p-2 mt-1 border rounded"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
        </form>
      )}
    </div>
  );
};

export default NodeEditor;
