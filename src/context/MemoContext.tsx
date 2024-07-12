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
  handleMemoUpdate: (targetMemo: Memo) => void;
  handleMemoDelete: (id: number) => void;
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
    if (userId) fetchAndSetMemos();
  }, [userId]);

  // GET：メモ一覧を取得
  const fetchMemos = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos`
      );
      if (!response.ok) throw new Error("Failed to fetch memos");
      const memos = await response.json();
      // 更新日時順にソート → ユーザーによる順番を保持する属性が必要
      // memos.sort((a: Memo, b: Memo) => {
      //   if (a.createdAt < b.createdAt) return 1;
      //   if (a.createdAt > b.createdAt) return -1;
      //   return 0;
      // });
      return memos;
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  const fetchAndSetMemos = async () => {
    const memos = await fetchMemos();
    setOriginalMemos(memos);
  };

  // PUT・POST：メモを更新・作成
  const handleMemoUpdate = async (targetMemo: Memo) => {
    // タイトルと内容のどちらかが入力されていない場合は何もしない
    if (!targetMemo.title && !targetMemo.content) return;

    // タイトルと内容が変更されていない場合は何もしない
    const originalMemo = originalMemos && originalMemos.find(
      (memo) => memo.id === targetMemo.id
    );
    if (
      originalMemo?.title === targetMemo.title &&
      originalMemo?.content === targetMemo.content
    ) {
      return;
    }

    const method = targetMemo.createdAt ? "PUT" : "POST";
    const url =
      method === "PUT"
        ? `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos/${targetMemo.id}` // PUT
        : `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos`; // POST

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: targetMemo.title,
          content: targetMemo.content,
        }),
      });
      if (!response.ok)
        throw new Error(
          `Failed to ${method === "PUT" ? "update" : "add"} memo`
        );
      fetchAndSetMemos();
      setNewMemo(initialMemo);
    } catch (error) {
      console.error(
        `Error ${method === "PUT" ? "updating" : "adding"} memo:`,
        error
      );
    }
  };

  // DELETE:メモを削除
  const handleMemoDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/memos/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error(`Failed to delete memos id: ${id}`);
      fetchAndSetMemos();
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
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
      handleMemoUpdate(targetMemo);
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
      handleMemoUpdate(targetMemo);
      return;
    }
  };

  const handleRowClick = (
    e: React.MouseEvent<HTMLDivElement>,
    titleRef: RefObject<HTMLInputElement>
  ) => {
    // クリック対象がpathの場合
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
        handleMemoUpdate,
        handleMemoDelete,
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
