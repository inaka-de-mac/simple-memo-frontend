import AuthContainer from "./AuthContainer/AuthContainer";
import { useAuthContext } from "../../context/AuthContext";
import MemoContainer from "./MemoContainer/MemoContainer";

const Main: React.VFC = () => {
  const { isSignedIn } = useAuthContext();
  return <div className="main">{isSignedIn ? <MemoContainer /> : <AuthContainer />}</div>;
};

export default Main;
