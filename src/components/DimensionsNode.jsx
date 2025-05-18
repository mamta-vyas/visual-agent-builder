import React from "react";

const DimensionsNode = ({ data }) => {
  return (
    <div style={{
      padding: 10,
      border: "2px solid #0047AB",
      borderRadius: 5,
      background: "#cce4ff",
      minWidth: 150,
      textAlign: "center",
      fontWeight: "bold",
    }}>
      <div>{data.label || "Dimensions Node"}</div>
      {/* You can display or edit any config values here */}
      <pre style={{ fontSize: 10, marginTop: 8 }}>
        {JSON.stringify(data.config, null, 2)}
      </pre>
    </div>
  );
};

export default DimensionsNode;
