import React from "react";
import "./App.css";
import MemoContainer from "./components/MemoContainer/MemoContainer";

const App: React.VFC = () => {
  return (
    <div className="App">
      <h1>Simple Memo</h1>
      <MemoContainer />
    </div>
  );
};

export default App;
