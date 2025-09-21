import { useState } from "react";

const ConnectionForm = ({ onConnect }) => {
  const [connString, setConnString] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (connString.trim()) {
      onConnect(connString);
    }
  };

  return (
    <form
      className="connection-form"
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
        SQL Server Connection
      </h3>

      <textarea
        value={connString}
        onChange={(e) => setConnString(e.target.value)}
        placeholder="Paste your SQL Server connection string..."
        rows={4}
        style={{
          resize: "vertical",
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "14px",
          fontFamily: "monospace",
        }}
      />

      <button
        type="submit"
        style={{
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "10px 14px",
          cursor: "pointer",
          fontWeight: "500",
        }}
      >
        Connect
      </button>
    </form>
  );
};

export default ConnectionForm;
