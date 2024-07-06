import "./App.css";
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
    </div>
  );
};

export default App;
