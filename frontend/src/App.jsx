import { useState } from "react";
import ERD from "./pages/ERD";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import "./pages/ERD.css";
import "./App.css";
export default function App() {
  const [schema, setSchema] = useState(null);
  const [status, setStatus] = useState("disconnected");
  const [error, setError] = useState(null);

  const handleConnect = async (connString) => {
    setStatus("connecting");
    setError(null);
    console.log("ConnectionString Sending:", connString);

    try {
      console.log("Sending request to backend...");
      const res = await axios.post("http://127.0.0.1:8000/api/schema", {
        connection_string: connString,
      });
      console.log("Backend response:", res.data);
      setSchema(res.data);
      setStatus("connected");
    } catch (err) {
      console.error("Axios error:", err.response || err.message);
      setError("❌ Failed to connect. Check your connection string.");
      setStatus("error");
    }
  };
  const handleExecuteSQL = async (sql) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/execute", {
        sql,
      });
      setSchema(res.data); // updated schema returned from backend
    } catch (err) {
      console.error("SQL Execution failed:", err);
      setError("❌ Failed to execute SQL");
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        onConnect={handleConnect}
        schema={schema}
        onExecuteSQL={handleExecuteSQL}
      />
      <main className="main-area">
        <div className="status-bar">
          Status: <span className={`status ${status}`}>{status}</span>
        </div>
        {error && <div className="error">{error}</div>}
        {schema ? (
          <ERD schema={schema} />
        ) : (
          <p className="placeholder">
            No schema loaded. Connect to a database.
          </p>
        )}
      </main>
    </div>
  );
}
