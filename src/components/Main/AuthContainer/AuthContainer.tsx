import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useAuthContext } from "../../../context/AuthContext";

const AuthContainer: React.VFC = () => {
  const { authMode, errorMessage } = useAuthContext();
  
  return (
    <div className="auth">
      <div className="auth__copy-box">
        <div className="auth__copy">メモをもっとシンプルに</div>
        <div className="auth__copy auth__copy--grayed">直感的にアイデアを書き出そう</div>
      </div>
      {authMode === "signup" ? <SignUp /> : <SignIn />}
      <div className="common__error auth__error">{errorMessage}</div>
    </div>
  );
};

export default AuthContainer;
