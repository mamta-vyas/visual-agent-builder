import React, { useEffect, useRef } from "react";

const OutputConsole = ({ logs, onClear }) => {
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full bg-black text-green-400 p-4 h-48 overflow-y-auto font-mono text-sm rounded-md shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-bold">🧪 Simulation Console</span>
        <button
          onClick={onClear}
          className="text-red-400 border border-red-400 px-2 py-0.5 rounded hover:bg-red-700 hover:text-white"
        >
          Clear
        </button>
      </div>
      <div ref={consoleRef}>
        {logs.length === 0 ? (
          <p className="text-gray-400">No output yet. Run simulation.</p>
        ) : (
          logs.map((log, index) => (
            <p
              key={index}
              className={`${
                log.type === "error" ? "text-red-400" : "text-green-400"
              }`}
            >
              {log.message}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default OutputConsole;
