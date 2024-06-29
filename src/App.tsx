import "./App.css";
import MemoContainer from "./components/Main/MemoContainer/MemoContainer";
import { MemoProvider } from "./context/MemoContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";

const App: React.VFC = () => {
  return (
    <div className="App">
      <AuthProvider>
        <Header />
        <Main />
      </AuthProvider>
      {/* <MemoProvider>
        <MemoContainer />
      </MemoProvider> */}
    </div>
  );
};

export default App;
