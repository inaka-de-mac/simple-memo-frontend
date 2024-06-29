import React from "react";
import { AuthMode } from "../../../Types";
import { useAuthContext } from "../../../context/AuthContext";

const SignUp: React.VFC = () => {
  const { handleAuthModeChange, signUpData, handleAuthFormChange, handleAuthClick } =
    useAuthContext();

  return (
    <div className="signup">
      <div className="auth__label-box">
        <p className="auth__label">アカウントを作成</p>
        <p
          className="auth__label auth__label--link"
          onClick={() => handleAuthModeChange(AuthMode.SIGNIN)}
        >
          サインイン
        </p>
      </div>
      <div className="auth__form-box">
        <input
          className="common__form common__form--input"
          name="userName"
          type="text"
          placeholder="ユーザー名を入力"
          value={signUpData.userName}
          onChange={handleAuthFormChange}
        />
        <input
          className="common__form common__form--input"
          name="email"
          type="text"
          placeholder="メールアドレスを入力"
          value={signUpData.email}
          onChange={handleAuthFormChange}
        />
        <input
          className="common__form common__form--input"
          name="password"
          type="password"
          placeholder="パスワードを入力"
          value={signUpData.password}
          onChange={handleAuthFormChange}
        />
        <button
          className="common__form common__form--button auth__form--button"
          onClick={handleAuthClick}
        >
          新規登録する
        </button>
      </div>
    </div>
  );
};

export default SignUp;
