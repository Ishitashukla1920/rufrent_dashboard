import React from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import "./index.css";

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <Dashboard />
      </div>
    </div>
  );
};

export default App;