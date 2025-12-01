import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./components/common/NotificationProvider";
import MainApp from "./pages/MainApp";
import UserDocs from "./pages/UserDocs";
import DeveloperDocs from "./pages/DeveloperDocs";

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/docs" element={<UserDocs />} />
          <Route path="/docs/developer" element={<DeveloperDocs />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;


