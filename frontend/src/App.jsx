import { useState } from "react";
import ERD from "./pages/ERD";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import "./pages/ERD.css";

export default function App() {
  const [schema, setSchema] = useState(null);
  const [status, setStatus] = useState("disconnected");
  const [error, setError] = useState(null);

  const handleConnect = async (connString) => {
    setStatus("connecting");
    setError(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/schema", {
        connection_string: connString,
      });
      setSchema(res.data);
      setStatus("connected");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to connect. Check your connection string.");
      setStatus("error");
    }
  };

  return (
    <div className="app-container">
      <Sidebar onConnect={handleConnect} schema={schema} />
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
