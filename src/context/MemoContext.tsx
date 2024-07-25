import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Memo } from "../Types";

// Contextオブジェクトの型
interface MemoContextProps {
  userMemos: Memo[];
  setUserMemos: (memos: Memo[]) => void;
  editingMemoId: number;
  setEditingMemoId: (id: number) => void;
  updateMemos: (memos: Memo[]) => void;
  handleUpdateMemo: (targetMemo: Memo) => void;
  handleCreateMemo: () => void;
  handleDeleteMemo: (targetMemo: Memo) => void;
  handleTitleKeyDown: (
    e: React.KeyboardEvent,
    titleRef: RefObject<HTMLInputElement>,
    contentRef: RefObject<HTMLTextAreaElement>,
    targetMemo: Memo
  ) => void;
  handleContentKeyDown: (
    e: React.KeyboardEvent,
    titleRef: RefObject<HTMLInputElement>,
    contentRef: RefObject<HTMLTextAreaElement>,
    targetMemo: Memo
  ) => void;
  handleRowClick: (
    e: React.MouseEvent<HTMLDivElement>,
    targetMemoId: number
  ) => void;
}

const MemoContext = createContext<MemoContextProps | undefined>(undefined);

const MemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userMemos, setUserMemos] = useState<Memo[]>([]); // データベースから取得したメモの一覧
  const [editingMemoId, setEditingMemoId] = useState<number>(-1);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return;
    setUserId(JSON.parse(userInfo).id);
  }, []);

  useEffect(() => {
    if (userId) fetchMemos();
  }, [userId]);

  // GET：メモ一覧を取得
  const fetchMemos = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos`
      );
      if (!response.ok) throw new Error("Failed to fetch memos");
      const memos = await response.json();
      memos.sort((a: Memo, b: Memo) => a.displayOrder - b.displayOrder);
      setUserMemos(memos);

      return memos;
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  // PUT：単一メモ更新
  const updateMemo = async (targetMemo: Memo) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos/${targetMemo.id}`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayOrder: targetMemo.displayOrder,
          title: targetMemo.title,
          content: targetMemo.content,
        }),
      });
      if (!response.ok) throw new Error(`Failed to update memo`);
    } catch (error) {
      console.error(`Error updating memo:`, error);
    }
  };

  // PUT：複数メモ更新
  const updateMemos = async (targetMemos: Memo[]) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetMemos),
      });
      if (!response.ok) throw new Error(`Failed to update memo`);
    } catch (error) {
      console.error(`Error updating memo:`, error);
    }
  };

  const handleUpdateMemo = async (targetMemo: Memo) => {
    const originalMemo = userMemos.find((memo) => memo.id === targetMemo.id);
    if (
      originalMemo?.title === targetMemo.title &&
      originalMemo?.content === targetMemo.content
    ) {
      return;
    }
    await updateMemo(targetMemo);
    fetchMemos();
  };

  // POST：単一メモ作成
  const createMemo = async () => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayOrder: 1,
          title: "",
          content: "",
        }),
      });
      if (!response.ok) throw new Error(`Failed to create memo`);
    } catch (error) {
      console.error(`Error creating memo:`, error);
    }
  };

  const handleCreateMemo = async () => {
    // DBに新規メモを作成
    await createMemo();
    // 既存メモの並び順を更新（新規作成時は全て+1)
    const newOriginalMemos = userMemos.map((memo, index) => {
      return { ...memo, displayOrder: index + 2 }; // indexは0始まりのため+1。作成したメモの分ずれるため+1
    });
    await updateMemos(newOriginalMemos);
    // メモ一覧を再取得
    fetchMemos();
  };

  // DELETE:単一メモ削除
  const deleteMemo = async (id: number) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos/${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete memo`);
    } catch (error) {
      console.error(`Error deleting memo:`, error);
    }
  };

  const handleDeleteMemo = async (targetMemo: Memo) => {
    // DBからメモを削除
    await deleteMemo(targetMemo.id);
    // 既存メモの並び順を更新
    const newOriginalMemos = userMemos
      .filter((memo) => memo.id !== targetMemo.id)
      .map((memo, index) => {
        return { ...memo, displayOrder: index + 1 }; // indexは0始まりのため+1
      });
    await updateMemos(newOriginalMemos);
    fetchMemos(); // メモ一覧を再取得
    setEditingMemoId(-1); // 編集中メモをリセット
  };

  const handleTitleKeyDown = (
    e: React.KeyboardEvent,
    titleRef: RefObject<HTMLInputElement>,
    contentRef: RefObject<HTMLTextAreaElement>,
    targetMemo: Memo
  ) => {
    // Command + Enter, Control + Enterで作成
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault(); // デフォルトの動作を無効化
      titleRef.current?.blur();
      handleUpdateMemo(targetMemo);
      return;
    }
    // Enter, Tabでコンテンツ入力欄にフォーカス
    if (
      (e.key === "Enter" && !e.nativeEvent.isComposing) ||
      (e.key === "Tab" && !e.shiftKey)
    ) {
      e.preventDefault();
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.select();
        return;
      }
    }

    // 変換時を除く下矢印押下でコンテンツ入力欄にフォーカス
    if (e.key === "ArrowDown" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (contentRef.current) {
        contentRef.current.focus();
        return;
      }
    }
  };

  // コンテンツ入力中のキーボード押下ハンドラ
  const handleContentKeyDown = (
    e: React.KeyboardEvent,
    titleRef: RefObject<HTMLInputElement>,
    contentRef: RefObject<HTMLTextAreaElement>,
    targetMemo: Memo
  ) => {
    // Command + Enter, Control + Enterで作成
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault(); // デフォルトの動作を無効化
      contentRef.current?.blur();
      handleUpdateMemo(targetMemo);
      return;
    }
  };

  const handleRowClick = (
    e: React.MouseEvent<HTMLDivElement>,
    targetMemoId: number
  ) => {
    const target = e.target as HTMLElement;
    if (
      target.classList.contains("memo__row") || // メモのラッパー
      target.classList.contains("memo__hover-box") || // メモ下部
      target.classList.contains("memo__updatedAt") // 更新日時
    ) {
      setEditingMemoId(-1);
    } else {
      setEditingMemoId(targetMemoId); // 編集中のメモID
    }
  };

  return (
    <MemoContext.Provider
      value={{
        userMemos,
        setUserMemos,
        editingMemoId,
        setEditingMemoId,
        updateMemos,
        handleUpdateMemo,
        handleCreateMemo,
        handleDeleteMemo,
        handleTitleKeyDown,
        handleContentKeyDown,
        handleRowClick,
      }}
    >
      {children}
    </MemoContext.Provider>
  );
};

// useMemoContextフックを追加
const useMemoContext = () => {
  const context = useContext(MemoContext);
  if (!context) {
    throw new Error("useMemoContext must be used within a MemoProvider");
  }
  return context;
};

export { MemoProvider, useMemoContext };
