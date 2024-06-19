import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { Memo } from "../Types";

// Contextオブジェクトの型
interface MemoContextProps {
  originalMemos: Memo[];
  currentMemos: Memo[];
  newMemo: Memo;
  setNewMemo: React.Dispatch<React.SetStateAction<Memo>>;
  textareaRefs: React.MutableRefObject<HTMLTextAreaElement[]>;
  fetchMemos: () => void;
  handleMemoUpdate: (targetMemo: Memo) => void;
  handleMemoDelete: (id: number) => void;
  handleMemoEdit: (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => void;
  handleRowClick: (tableId: number) => void;
  handleKeyDown: (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => void;
}

const MemoContext = createContext<MemoContextProps | undefined>(undefined);

const MemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [originalMemos, setOriginalMemos] = useState<Memo[]>([]); // データベースから取得したメモの一覧
  const [currentMemos, setCurrentMemos] = useState<Memo[]>([]); // フロントエンドで変更したメモの一覧
  const initialMemo: Memo = { id: -1, content: "", createdAt: "", updatedAt: "" };
  const [newMemo, setNewMemo] = useState<Memo>(initialMemo); // 新規メモ
  const textareaRefs = useRef<HTMLTextAreaElement[]>([]); // 対象のテキストエリアにfocusするために使用

  useEffect(() => {
    fetchAndSetMemos();
  }, []);

  // GET：メモ一覧を取得
  const fetchMemos = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/memos`);
      if (!response.ok) throw new Error("Failed to fetch memos");
      const memos = await response.json();
      return memos;
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  const fetchAndSetMemos = async () => {
    const memos = await fetchMemos();
    console.log(memos);
    setOriginalMemos(memos);
    setCurrentMemos(JSON.parse(JSON.stringify(memos)));
  };

  // PUT・POST：メモを更新・作成
  const handleMemoUpdate = async (targetMemo: Memo) => {
    console.log("handleMemoUpdate");

    if (targetMemo?.content.trim() === "") {
      setCurrentMemos(originalMemos);
      return;
    }

    const url = targetMemo.createdAt
      ? `${process.env.REACT_APP_API_BASE_URL}/api/memos/${targetMemo.id}` // PUT
      : `${process.env.REACT_APP_API_BASE_URL}/api/memos`; // POST
    const method = targetMemo.createdAt ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: targetMemo.content,
      });
      if (!response.ok)
        throw new Error(`Failed to ${method === "PUT" ? "update" : "add"} memo`);
      setNewMemo(initialMemo);
      fetchAndSetMemos();
    } catch (error) {
      console.error(`Error ${method === "PUT" ? "updating" : "adding"} memo:`, error);
    }
  };

  // DELETE:メモを削除
  const handleMemoDelete = async (id: number) => {
    console.log("handleMemoDelete");
    console.log(`${process.env.REACT_APP_API_BASE_URL}/api/memos/${id}`);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/memos/${id}`,
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

  const handleMemoEdit = (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => {
    console.log("handleMemoEdit");
    // 編集中の内容を更新
    setCurrentMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id ? { ...memo, content: e.target.value } : memo
      )
    );
  };

  // 列のどこかをクリックしたら、対象のテキストエリアにfocusする
  const handleRowClick = (tableId: number) => {
    console.log("handleRowClick");
    const textarea = textareaRefs.current[tableId];
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  };

  // キーを押したときの処理
  const handleKeyDown = (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => {
    console.log("handleKeyDown");
    if (e.key === "Enter" && !e.shiftKey && e.keyCode !== 229) {
      // 変換確定(229)を除くEnterキー押下時の処理
      e.preventDefault();
      handleMemoUpdate(targetMemo);
      if (tableId < currentMemos.length) {
        handleRowClick(tableId + 1); // 次のメモに移動(あれば)
      }
    } else if (e.key === "Escape") {
      // escキーが押された場合の処理
      const textarea = textareaRefs.current[tableId];
      if (textarea) textarea.blur();
    }
    // Enterのデフォルト（改行）をキャンセルしているので自動的にshift+Enterで改行される
  };

  return (
    <MemoContext.Provider
      value={{
        originalMemos,
        currentMemos,
        newMemo,
        setNewMemo,
        textareaRefs,
        fetchMemos,
        handleMemoUpdate,
        handleMemoDelete,
        handleMemoEdit,
        handleRowClick,
        handleKeyDown,
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

export {MemoProvider, useMemoContext};
