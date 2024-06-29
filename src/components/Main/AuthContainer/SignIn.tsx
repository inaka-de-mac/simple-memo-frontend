import { AuthMode } from "../../../Types";
import { useAuthContext } from "../../../context/AuthContext";
const SignIn: React.VFC = () => {
  const { handleAuthModeChange, signInData, handleAuthFormChange, handleAuthClick } =
    useAuthContext();
  return (
    <>
      <div className="auth__label-box">
        <p className="auth__label">サインイン</p>
        <p
          className="auth__label auth__label--link"
          onClick={() => handleAuthModeChange(AuthMode.SIGNUP)}
        >
          アカウントを作成
        </p>
      </div>
      <div className="auth__form-box">
        <input
          className="common__form common__form--input"
          name="email"
          type="text"
          placeholder="メールアドレスを入力"
          value={signInData.email}
          onChange={handleAuthFormChange}
        />
        <input
          className="common__form common__form--input"
          name="password"
          type="password"
          placeholder="パスワードを入力"
          value={signInData.password}
          onChange={handleAuthFormChange}
        />
        <button
          className="common__form common__form--button auth__form--button"
          onClick={handleAuthClick}
        >
          サインインする
        </button>
      </div>
    </>
  );
};

export default SignIn;
