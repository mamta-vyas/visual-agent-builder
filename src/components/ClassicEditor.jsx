// File: src/components/ClassicEditor.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";

const ClassicEditor = () => {
  return (
    <div className="flex flex-row h-full w-full bg-white">
      <Sidebar className="w-64" /> {/* fixed width sidebar */}
      <div className="flex-1 overflow-auto">
        <Canvas />
      </div>
    </div>
  );
};

export default ClassicEditor;
