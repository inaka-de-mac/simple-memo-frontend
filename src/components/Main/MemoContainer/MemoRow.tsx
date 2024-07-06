import React, { useEffect, useState, useRef } from "react";
import { Memo, MemoRowProps } from "../../../Types";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMemoContext } from "../../../context/MemoContext";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";

const MemoRow: React.VFC<MemoRowProps> = ({ originalMemo }) => {
  const {
    handleMemoUpdate,
    handleMemoDelete,
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
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
  };
  return (
    <div
      className="memo__row"
      key={currentMemo.id}
      onClick={(e) => handleRowClick(e, titleRef)}
    >
      <input
        type="text"
        className="memo__form memo__form--title"
        value={currentMemo.title}
        placeholder="Enter Title"
        onChange={(e) =>
          setCurrentMemo({ ...currentMemo, title: e.target.value })
        }
        onBlur={() => handleMemoUpdate(currentMemo)}
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
        onBlur={() => handleMemoUpdate(currentMemo)}
        ref={contentRef}
        onKeyDown={(e) =>
          handleContentKeyDown(e, titleRef, contentRef, currentMemo)
        }
      />
      <div className="memo__hover-box">
        <div className="memo__left-box">
          <p className="memo__shortcut">
            <span className="memo__shortcut-key">Enter</span>
            <span className="memo__shortcut-desc">改行</span>
          </p>
          <p className="memo__shortcut">
            <span className="memo__shortcut-key">
              <KeyboardCommandKeyIcon sx={{ width: "1rem", height: "1rem" }} />
              +Enter
            </span>
            <span className="memo__shortcut-desc">保存</span>
          </p>
        </div>
        <div className="memo__right-box">
          <div className="memo__date-box">
            <p className="memo__createdAt">
              作成 {formatDate(currentMemo.createdAt)}
            </p>
            <p className="memo__updatedAt">
              更新 {formatDate(currentMemo.updatedAt)}
            </p>
          </div>
          <button
            className="memo__delete"
            onClick={() => handleMemoDelete(currentMemo.id)}
          >
            <DeleteIcon sx={{ width: "1.8rem", height: "1.8rem" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoRow;
