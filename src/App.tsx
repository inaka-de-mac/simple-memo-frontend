import React, { useEffect, useRef, useState } from "react";
import { Memo } from "./Types"; // Memo型をインポートする
import "./App.css";
// MUI
import DeleteIcon from "@mui/icons-material/Delete";

const App: React.FC = () => {
  const [originalMemos, setOriginalMemos] = useState<Memo[]>([]); // backendと同期した編集前のメモ
  const [currentMemos, setCurrentMemos] = useState<Memo[]>([]); // backendから一部修正される可能性のあるメモ一覧
  const initialMemo: Memo = {
    id: -1,
    content: "",
    createdAt: "",
    updatedAt: "",
  };
  const [addingMemo, setAddingMemo] = useState<Memo>(initialMemo); // 新規メモ
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]); // 対象のテキストエリアにfocusするために使用

  useEffect(() => {
    fetchMemos();
  }, []);

  // GET：メモ一覧を取得
  const fetchMemos = async () => {
    try {
      console.log(`fetching memos from ${process.env.REACT_APP_API_BASE_URL}/api/memos`);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/memos`);
      console.log(`response.status: ${response.status}`);
      console.log(`response.ok: ${response.ok}`);
      console.log(`response.url: ${response.url}`);
      console.log(`response.type: ${response.type}`);
      console.log(`response.redirected: ${response.redirected}`);
      if (!response.ok) {
        // エラーの詳細をコンソールに出力する
        console.error(`Failed to fetch memos: ${response.status} ${response.statusText}`);
        throw new Error("Failed to fetch memos");
      }
      const memos = await response.json();
      // バックエンドと同期した編集前のメモ
      setOriginalMemos(memos);
      // フロントで修正したバックエンド反映前のメモ
      setCurrentMemos(JSON.parse(JSON.stringify(memos)));
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  const handleMemoEdit = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    id: number
  ) => {
    // 編集中の内容を更新
    setCurrentMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id ? { ...memo, content: e.target.value } : memo
      )
    );
  };

  // PUT・POST：メモを更新・作成
  const handleMemoUpdate = async (targetMemo: Memo) => {
    // 空メモの場合は終了(空白文字のみも終了の対象)
    if (targetMemo?.content.trim() === "") {
      setCurrentMemos(originalMemos);
      return;
    }

    if (targetMemo.createdAt !== "") {
      // 修正
      const isUpdating = originalMemos.some(
        (memo) =>
          memo.id === targetMemo.id && memo.content !== targetMemo.content
      );
      // 変更されてなかったら終了
      if (!isUpdating) {
        return;
      }
      // API通信
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/memos/${targetMemo.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: targetMemo.content,
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to update memos id: ${targetMemo.id}`);
        }
      } catch (error) {
        console.error("Error updating memo:", error);
      }
    } else {
      // 登録
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/memos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: targetMemo.content,
        });
        if (!response.ok) {
          throw new Error("Failed to add memos");
        }
        setAddingMemo(initialMemo);
      } catch (error) {
        console.error("Error adding memo:", error);
      }
    }
    // 反映後のメモ一覧を取得
    fetchMemos();
  };

  // 列のどこかをクリックしたら、対象のテキストエリアにfocusする
  const handleRowClick = (tableId: number) => {
    const textarea = textareaRefs.current[tableId];
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(
        textarea.value.length, // 選択範囲の開始位置
        textarea.value.length // 選択範囲の終了位置
      );
    }
  };

  // DELETE:メモを削除
  const handleMemoDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/memos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete memos id: ${id}`);
      }
      // 反映後のメモ一覧を取得
      fetchMemos();
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  // キーを押したときの処理
  const handleKeyDown = (
    e: React.KeyboardEvent,
    targetMemo: Memo,
    tableId: number
  ) => {
    if (e.key === "Enter" && !e.shiftKey && e.keyCode !== 229) {
      // 変換確定(229)を除くEnterキー押下時の処理
      e.preventDefault(); // デフォルトのEnterキーの動作(改行)をキャンセル
      handleMemoUpdate(targetMemo); // 対象のメモを更新・登録する
      // 次のメモに移動(あれば)
      if (tableId < currentMemos.length) {
        handleRowClick(tableId + 1);
      }
    } else if (e.key === "Escape") {
      // escキーが押された場合の処理
      const textarea = textareaRefs.current[tableId];
      if (textarea) {
        textarea.blur();
      }
    }
    // Enterのデフォルト（改行）をキャンセルしているので自動的にshift+Enterで改行される
  };

  return (
    <div className="App">
      <h1>Simple Memo</h1>
      <table className="memo__table">
        <tbody>
          {currentMemos.map((memo, tableId) => (
            <tr
              className="memo__row"
              key={memo.id}
              onClick={() => handleRowClick(tableId)}
            >
              <td>
                <textarea
                  className="memo__textarea"
                  value={memo.content}
                  onChange={(e) => {
                    handleMemoEdit(e, memo.id);
                  }}
                  onBlur={() => handleMemoUpdate(memo)}
                  ref={(textareaDOM) =>
                    (textareaRefs.current[tableId] = textareaDOM)
                  }
                  onKeyDown={(e) => handleKeyDown(e, memo, tableId)}
                />
              </td>
              <td className="memo__updatedAt">{memo.updatedAt}</td>
              <td>
                <button
                  onClick={() => handleMemoDelete(memo.id)}
                  className="memo__delete"
                >
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
          {/* 新規追加行 */}
          <tr
            className="memo__row"
            onClick={() => handleRowClick(currentMemos.length)}
          >
            <td>
              <textarea
                className="memo__textarea"
                value={addingMemo?.content}
                placeholder="Create Your Memo"
                onChange={(e) =>
                  setAddingMemo({
                    id: -1,
                    content: e.target.value,
                    createdAt: "",
                    updatedAt: "",
                  })
                }
                onBlur={() => handleMemoUpdate(addingMemo!)}
                ref={(textareaDOM) =>
                  (textareaRefs.current[currentMemos.length] = textareaDOM)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, addingMemo, currentMemos.length)
                }
              />
            </td>
            <td className="memo__updatedAt"></td>
            <td>
              <button className="memo__delete"></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
