import React from "react";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import NodeEditor from "./components/NodeEditor";

function App() {
  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <Canvas />
      <NodeEditor />
    </div>
  );
}

export default App;
