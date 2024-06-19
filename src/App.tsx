import React from "react";
import "./App.css";
import MemoContainer from "./components/MemoContainer/MemoContainer";
import { MemoProvider } from "./context/MemoContext";

const App: React.VFC = () => {
  return (
    <div className="App">
      <h1>Simple Memo</h1>
      <MemoProvider>
        <MemoContainer />
      </MemoProvider>
    </div>
  );
};

export default App;
