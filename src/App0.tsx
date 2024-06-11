import React, { useEffect, useRef, useState } from "react";
import { Memo } from "./Types";
import "./App.css";
import DeleteIcon from "@mui/icons-material/Delete";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Simple Memo</h1>
      <MemoContainer />
    </div>
  );
};

const MemoContainer: React.FC = () => {
  const [originalMemos, setOriginalMemos] = useState<Memo[]>([]); // データベースから取得したメモの一覧
  const [currentMemos, setCurrentMemos] = useState<Memo[]>([]); // フロントエンドで変更したメモの一覧
  const initialMemo: Memo = { id: -1, content: "", createdAt: "", updatedAt: "" };
  const [newMemo, setNewMemo] = useState<Memo>(initialMemo); // 新規メモ
  const textareaRefs = useRef<HTMLTextAreaElement[]>([]); // 対象のテキストエリアにfocusするために使用

  useEffect(() => {
    fetchMemos();
  }, []);

  // GET：メモ一覧を取得
  const fetchMemos = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/memos`);
      if (!response.ok) throw new Error("Failed to fetch memos");
      const memos = await response.json();
      setOriginalMemos(memos);
      setCurrentMemos(JSON.parse(JSON.stringify(memos)));
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  // PUT・POST：メモを更新・作成
  const handleMemoUpdate = async (targetMemo: Memo) => {
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
      fetchMemos();
    } catch (error) {
      console.error(`Error ${method === "PUT" ? "updating" : "adding"} memo:`, error);
    }
  };

  // DELETE:メモを削除
  const handleMemoDelete = async (id: number) => {
    console.log(`${process.env.REACT_APP_API_BASE_URL}/api/memos/${id}`);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/memos/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error(`Failed to delete memos id: ${id}`);
      fetchMemos();
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  const handleMemoEdit = (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => {
    // 編集中の内容を更新
    setCurrentMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id ? { ...memo, content: e.target.value } : memo
      )
    );
  };

  // 列のどこかをクリックしたら、対象のテキストエリアにfocusする
  const handleRowClick = (tableId: number) => {
    const textarea = textareaRefs.current[tableId];
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  };

  // キーを押したときの処理
  const handleKeyDown = (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => {
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
    <table className="memo__table">
      <tbody>
        <MemoTable
          currentMemos={currentMemos}
          handleRowClick={handleRowClick}
          handleMemoUpdate={handleMemoUpdate}
          handleKeyDown={handleKeyDown}
          handleMemoDelete={handleMemoDelete}
          handleMemoEdit={handleMemoEdit}
          textareaRefs={textareaRefs}
        />
        <NewMemoRow
          newMemo={newMemo}
          handleRowClick={handleRowClick}
          currentMemos={currentMemos}
          setNewMemo={setNewMemo}
          handleMemoUpdate={handleMemoUpdate}
          handleKeyDown={handleKeyDown}
          textareaRefs={textareaRefs}
        />
      </tbody>
    </table>
  );
};

const MemoTable: React.FC<{
  currentMemos: Memo[];
  handleRowClick: (tableId: number) => void;
  handleMemoUpdate: (memo: Memo) => void;
  handleKeyDown: (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => void;
  handleMemoDelete: (id: number) => void;
  handleMemoEdit: (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => void;
  textareaRefs: React.MutableRefObject<HTMLTextAreaElement[]>;
}> = ({
  currentMemos,
  handleRowClick,
  handleMemoUpdate,
  handleKeyDown,
  handleMemoDelete,
  handleMemoEdit,
  textareaRefs,
}) => {
  return (
    <>
      {currentMemos.map((memo, tableId) => (
        <MemoRow
          memo={memo}
          tableId={tableId}
          key={memo.id}
          handleRowClick={handleRowClick}
          handleMemoUpdate={handleMemoUpdate}
          handleKeyDown={handleKeyDown}
          handleMemoDelete={handleMemoDelete}
          handleMemoEdit={handleMemoEdit}
          textareaRefs={textareaRefs}
        />
      ))}
    </>
  );
};

const MemoRow: React.FC<{
  memo: Memo;
  tableId: number;
  handleRowClick: (tableId: number) => void;
  handleMemoUpdate: (memo: Memo) => void;
  handleKeyDown: (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => void;
  handleMemoDelete: (id: number) => void;
  handleMemoEdit: (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => void;
  textareaRefs: React.MutableRefObject<HTMLTextAreaElement[]>;
}> = ({
  memo,
  tableId,
  handleRowClick,
  handleMemoUpdate,
  handleKeyDown,
  handleMemoDelete,
  handleMemoEdit,
  textareaRefs,
}) => {
  return (
    <tr className="memo__row" key={memo.id} onClick={() => handleRowClick(tableId)}>
      <td>
        <textarea
          className="memo__textarea"
          value={memo.content}
          onChange={(e) => {
            handleMemoEdit(e, memo.id);
          }}
          onBlur={() => handleMemoUpdate(memo)}
          ref={(textareaDOM) => {
            if (textareaDOM) {
              textareaRefs.current[tableId] = textareaDOM;
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, memo, tableId)}
        />
      </td>
      <td className="memo__updatedAt">{memo.updatedAt}</td>
      <td>
        <button className="memo__delete" onClick={() => handleMemoDelete(memo.id)}>
          <DeleteIcon />
        </button>
      </td>
    </tr>
  );
};

const NewMemoRow: React.FC<{
  newMemo: Memo;
  handleRowClick: (tableId: number) => void;
  currentMemos: Memo[];
  setNewMemo: React.Dispatch<React.SetStateAction<Memo>>;
  handleMemoUpdate: (memo: Memo) => void;
  handleKeyDown: (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => void;
  textareaRefs: React.MutableRefObject<HTMLTextAreaElement[]>;
}> = ({
  newMemo,
  handleRowClick,
  currentMemos,
  setNewMemo,
  handleMemoUpdate,
  handleKeyDown,
  textareaRefs,
}) => {
  return (
    <tr className="memo__row" onClick={() => handleRowClick(currentMemos.length)}>
      <td>
        <textarea
          className="memo__textarea"
          value={newMemo.content}
          placeholder="Create Your Memo"
          onChange={(e) =>
            setNewMemo({
              id: -1,
              content: e.target.value,
              createdAt: "",
              updatedAt: "",
            })
          }
          onBlur={() => handleMemoUpdate(newMemo!)}
          ref={(textareaDOM) => {
            if (textareaDOM) {
              textareaRefs.current[currentMemos.length] = textareaDOM;
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, newMemo, currentMemos.length)}
        />
      </td>
      <td className="memo__updatedAt"></td>
      <td>
        <button className="memo__delete"></button>
      </td>
    </tr>
  );
};

export default App;
