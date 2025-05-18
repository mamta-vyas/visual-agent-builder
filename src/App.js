// File: src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AgentBuilder from "./components/AgentBuilder";
import ClassicEditor from "./components/ClassicEditor";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden">
        <nav className="bg-gray-800 text-white px-4 py-2 flex gap-4">
          <Link to="/" className="hover:underline">Agent Builder</Link>
          <Link to="/classic" className="hover:underline">Classic Editor</Link>
        </nav>

        <div className="flex-1 min-h-[calc(100vh-48px)] overflow-auto">
          <Routes>
            <Route path="/" element={<AgentBuilder />} />
            <Route path="/classic" element={<ClassicEditor />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
