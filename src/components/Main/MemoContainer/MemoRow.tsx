import React, { useEffect, useState, useRef } from "react";
import { Memo, MemoRowProps } from "../../../Types";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMemoContext } from "../../../context/MemoContext";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";

const MemoRow: React.VFC<MemoRowProps> = ({ originalMemo }) => {
  const {
    setEditingMemoId,
    handleUpdateMemo,
    handleDeleteMemo,
    handleTitleKeyDown,
    handleContentKeyDown,
    handleRowClick,
  } = useMemoContext();
  const [currentMemo, setCurrentMemo] = useState<Memo>(originalMemo);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentMemo(originalMemo);
  }, [originalMemo]);

  // 日時フォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    // 時刻は0埋めする
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  };
  return (
    <div
      className="memo__row"
      key={currentMemo.id}
      onClick={(e) => handleRowClick(e, currentMemo.id)}
    >
      <input
        type="text"
        className="memo__form memo__form--title"
        value={currentMemo.title}
        placeholder="Enter Title"
        onChange={(e) =>
          setCurrentMemo({ ...currentMemo, title: e.target.value })
        }
        onBlur={() => {
          setEditingMemoId(-1);
          handleUpdateMemo(currentMemo);
        }}
        onKeyDown={(e) =>
          handleTitleKeyDown(e, titleRef, contentRef, currentMemo)
        }
        ref={titleRef}
      />
      <textarea
        className="memo__form memo__form--content"
        value={currentMemo.content}
        placeholder="Enter Content"
        onChange={(e) =>
          setCurrentMemo({ ...currentMemo, content: e.target.value })
        }
        onBlur={() => {
          setEditingMemoId(-1);
          handleUpdateMemo(currentMemo);
        }}
        ref={contentRef}
        onKeyDown={(e) =>
          handleContentKeyDown(e, titleRef, contentRef, currentMemo)
        }
      />
      <div className="memo__hover-box">
        <div className="memo__left-box"></div>
        <p className="memo__updatedAt">
          更新 {formatDate(currentMemo.updatedAt)}
        </p>
        <button
          className="memo__delete"
          onClick={() => handleDeleteMemo(currentMemo)}
        >
          <DeleteIcon sx={{ width: "1.8rem", height: "1.8rem" }} />
        </button>
      </div>
    </div>
  );
};

export default MemoRow;
