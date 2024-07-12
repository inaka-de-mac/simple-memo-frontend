import React, { useEffect, useState } from "react";
import { createContext, ReactNode } from "react";
import {
  AuthContextProps,
  initialSignUpData,
  SignUpData,
  initialSignInData,
  SignInData,
  AuthMode,
} from "../Types";

// コンテキストを作成
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 認証状態
  const [isSignedIn, setIsSignedIn] = useState(false);
  // 画面状態
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.SIGNIN);
  const [signUpData, setSignUpData] = useState<SignUpData>(initialSignUpData); // サインアップ時の入力内容
  const [signInData, setSignInData] = useState<SignInData>(initialSignInData); // サインイン時の入力内容
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [deleteConfirm, setDeleteConfirm] = useState<string>(""); // アカウント削除確認時の入力内容
  const [modalOpen, setModalOpen] = useState(false);

  // サインイン状態の復元
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setIsSignedIn(true);
    }
  }, []);

  // 認証モードの変更
  const handleAuthModeChange = (newMode: AuthMode) => {
    setAuthMode(newMode);
    setErrorMessage("");
  };

  // フォームの入力変更ハンドリング
  const handleAuthFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    if (authMode === AuthMode.SIGNUP) {
      setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    } else if (authMode === AuthMode.SIGNIN) {
      setSignInData({ ...signInData, [e.target.name]: e.target.value });
    }
  };

  // 認証処理
  const handleAuthClick = async () => {
    const varidationResult = varidateForm();
    if (!varidationResult) return;

    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const endpoint = authMode === AuthMode.SIGNUP ? "signup" : "signin";
    const url = `${baseUrl}/api/${endpoint}`;
    const requestBody = authMode === AuthMode.SIGNUP ? signUpData : signInData;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (authMode === AuthMode.SIGNUP) {
          setErrorMessage("このメールアドレスはすでに登録されています");
        } else if (authMode === AuthMode.SIGNIN) {
          setErrorMessage("メールアドレスもしくはパスワードが違います");
        } else {
          setErrorMessage("認証に失敗しました。");
        }
        throw new Error("Failed to auth request");
      }
      resetForm(); // 入力フォームをリセット
      const userInfo = await response.json();
      localStorage.setItem("userInfo", JSON.stringify(userInfo)); // ローカルストレージに保存
      setIsSignedIn(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const varidateForm = () => {
    setErrorMessage("");

    if (authMode === AuthMode.SIGNUP) {
      if (!signUpData.userName || !signUpData.email || !signUpData.password) {
        setErrorMessage("入力欄が空欄の場合は入力してください");
        return false;
      }
      if (
        getByteLength(signUpData.userName) > 255 ||
        getByteLength(signUpData.email) > 255 ||
        getByteLength(signUpData.password) > 255
      ) {
        setErrorMessage("文字数制限を超えています");
        return false;
      }
    } else if (authMode === AuthMode.SIGNIN) {
      if (!signInData.email || !signInData.password) {
        setErrorMessage("入力欄が空欄の場合は入力してください");
        return false;
      }
    }

    return true;
  };

  const getByteLength = (content: string) => {
    const encoder = new TextEncoder();
    const byteArray = encoder.encode(content);
    return byteArray.length;
  };

  // サインアウト処理
  const handleSignOut = () => {
    setErrorMessage("");
    localStorage.removeItem("userInfo");
    setIsSignedIn(false);
  };

  // アカウント削除処理
  const handleDeleteClick = async () => {
    if (deleteConfirm !== "アカウント削除") {
      setErrorMessage("入力内容を確認してください");
      return;
    }

    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const url = `${baseUrl}/api/account`;
    const userInfo = localStorage.getItem("userInfo");
    const email = userInfo ? JSON.parse(userInfo).email : "";
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "text/plain",
        },
        body: email,
      });

      if (!response.ok) {
        setErrorMessage("アカウント削除に失敗しました。");
        throw new Error("Failed to auth request");
      }
      setIsSignedIn(false);
      setErrorMessage("");
      localStorage.removeItem("userInfo"); // ローカルストレージから削除
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 画面状態のリセット
  const resetForm = () => {
    setAuthMode(AuthMode.SIGNIN);
    setSignUpData(initialSignUpData);
    setSignInData(initialSignInData);
    setDeleteConfirm("");
    setErrorMessage("");
    setModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        authMode,
        handleAuthModeChange,
        handleAuthFormChange,
        signUpData,
        signInData,
        handleAuthClick,
        errorMessage,
        handleSignOut,
        deleteConfirm,
        setDeleteConfirm,
        handleDeleteClick,
        setErrorMessage,
        modalOpen,
        setModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// contextオブジェクトを子が直接触らずに済むようにする
const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuthContext };
