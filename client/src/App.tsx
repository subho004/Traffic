// src/App.tsx

import React from "react";
import NodeTree from "./components/NodeTree";
import "./App.scss";

import "./App.scss";

const App: React.FC = () => {
  return (
    <>
      <div className="app">
        <h1>Node Visualization App</h1>
        <NodeTree />
      </div>
    </>
  );
};

export default App;
