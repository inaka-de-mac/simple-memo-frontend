import AuthContainer from "./AuthContainer/AuthContainer";
import { useAuthContext } from "../../context/AuthContext";
import MemoContainer from "./MemoContainer/MemoContainer";
import { MemoProvider } from "../../context/MemoContext";

const Main: React.VFC = () => {
  const { isSignedIn } = useAuthContext();
  return (
    <div className="main">
      {isSignedIn ? (
        <MemoProvider>
          <MemoContainer />
        </MemoProvider>
      ) : (
        <AuthContainer />
      )}
    </div>
  );
};

export default Main;
