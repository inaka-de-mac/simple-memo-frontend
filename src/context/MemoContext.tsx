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
  originalMemos: Memo[];
  setOriginalMemos: (memos: Memo[]) => void;
  updateMemos: (memos: Memo[]) => void;
  handleUpdateMemo: (targetMemo: Memo) => void;
  handleCreateMemo: (targetMemo: Memo) => void;
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
    titleRef: RefObject<HTMLInputElement>
  ) => void;
  newMemo: Memo;
  setNewMemo: (memo: Memo) => void;
}

const MemoContext = createContext<MemoContextProps | undefined>(undefined);

const MemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [originalMemos, setOriginalMemos] = useState<Memo[]>([]); // データベースから取得したメモの一覧
  const [userId, setUserId] = useState("");
  const initialMemo: Memo = {
    id: -1,
    userId: Number(userId),
    displayOrder: 1, // 常に先頭に追加
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  };
  const [newMemo, setNewMemo] = useState<Memo>(initialMemo);

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
      setOriginalMemos(memos);

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
    // タイトルと内容が変更されていない場合は何もしない
    const originalMemo = originalMemos.find(
      (memo) => memo.id === targetMemo.id
    );
    if (
      originalMemo?.title === targetMemo.title &&
      originalMemo?.content === targetMemo.content
    ) {
      return;
    }
    await updateMemo(targetMemo);
    fetchMemos();
    setNewMemo(initialMemo);
  };

  // POST：単一メモ作成
  const createMemo = async (targetMemo: Memo) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayOrder: targetMemo.displayOrder,
          title: targetMemo.title,
          content: targetMemo.content,
        }),
      });
      if (!response.ok) throw new Error(`Failed to create memo`);
    } catch (error) {
      console.error(`Error creating memo:`, error);
    }
  };

  const handleCreateMemo = async (targetMemo: Memo) => {
    // タイトルと内容が入力されていない場合は何もしない
    if (targetMemo.title === "" && targetMemo.content === "") {
      return;
    }

    await createMemo(targetMemo); // DBに新規メモを作成
    // 既存メモの並び順を更新（新規作成時は全て+1)
    const newOriginalMemos = originalMemos.map((memo) => {
      return { ...memo, displayOrder: memo.displayOrder + 1 };
    });
    await updateMemos(newOriginalMemos);
    fetchMemos();
    setNewMemo(initialMemo);
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
    await deleteMemo(targetMemo.id);
    // 既存メモの並び順を更新
    const newOriginalMemos = originalMemos
      .filter((memo) => memo.id !== targetMemo.id)
      .map((memo) => {
        if (memo.displayOrder > targetMemo.displayOrder) {
          // 削除対象以降を-1
          return { ...memo, displayOrder: memo.displayOrder - 1 };
        }
        return memo;
      });
    await updateMemos(newOriginalMemos);
    fetchMemos();
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
      if (targetMemo.createdAt) {
        handleUpdateMemo(targetMemo);
      } else {
        handleCreateMemo(targetMemo);
      }
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
      if (targetMemo.createdAt) {
        handleUpdateMemo(targetMemo);
      } else {
        handleCreateMemo(targetMemo);
      }
      return;
    }
  };

  const handleRowClick = (
    e: React.MouseEvent<HTMLDivElement>,
    titleRef: RefObject<HTMLInputElement>
  ) => {
    const target = e.target as HTMLElement;
    // クリック対象が動的要素ではない場合
    if (
      !target.classList.contains("memo__form") && // 入力欄
      !target.classList.contains("memo__delete") && // 削除アイコンのラッパー
      !(target.tagName === "path") // 削除アイコン(path)
    ) {
      // タイトル入力欄にフォーカス
      titleRef.current?.focus();
      titleRef.current?.select();
    }
  };

  return (
    <MemoContext.Provider
      value={{
        originalMemos,
        setOriginalMemos,
        updateMemos,
        handleUpdateMemo,
        handleCreateMemo,
        handleDeleteMemo,
        handleTitleKeyDown,
        handleContentKeyDown,
        handleRowClick,
        newMemo,
        setNewMemo,
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
