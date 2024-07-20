// memosテーブルと同一の型にする
export interface Memo {
  id: number;
  userId: number;
  displayOrder: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoRowProps {
  originalMemo: Memo;
}

export interface AuthContextProps {
  isSignedIn: boolean;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  authMode: AuthMode;
  handleAuthModeChange: (newMode: AuthMode) => void;
  handleAuthFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  signUpData: SignUpData;
  signInData: SignInData;
  handleAuthClick: () => void;
  errorMessage: string;
  handleSignOut: () => void;
  deleteConfirm: string;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteClick: () => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SignUpData {
  userName: string;
  email: string;
  password: string;
}

export const initialSignUpData: SignUpData = {
  userName: "",
  email: "",
  password: "",
};

export interface SignInData {
  email: string;
  password: string;
}

export const initialSignInData: SignInData = {
  email: "",
  password: "",
};

export enum AuthMode {
  SIGNIN = "signin",
  SIGNUP = "signup",
}

export interface HeaderMenuProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}
