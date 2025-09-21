import React, { useState } from "react";

const CodeSection = ({ onExecute }) => {
  const [code, setCode] = useState("");

  return (
    <div>
      <h4>Create Table / SQL Editor</h4>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your CREATE TABLE statement here..."
        rows={15}
        style={{
          width: "100%",
          fontFamily: "monospace",
          fontSize: "14px",
          padding: "10px",
        }}
      />
      <button
        onClick={() => onExecute(code)}
        style={{
          marginTop: "10px",
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Execute / Preview
      </button>
    </div>
  );
};

export default CodeSection;
