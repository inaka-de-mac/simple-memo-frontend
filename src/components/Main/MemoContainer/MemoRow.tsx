import React, { useEffect, useState, useRef } from "react";
import { Memo, MemoRowProps } from "../../../Types";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMemoContext } from "../../../context/MemoContext";
import PopupEditor from "../../Editor/PopupEditor";
import IconTooltip from "../../Editor/IconTooltop";

const MemoRow: React.VFC<MemoRowProps> = ({ userMemo }) => {
  const {
    setEditingMemoId,
    handleUpdateMemo,
    handleDeleteMemo,
    handleTitleKeyDown,
    handleContentKeyDown,
    handleRowClick,
  } = useMemoContext();
  const [currentMemo, setCurrentMemo] = useState<Memo>(userMemo);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentMemo(userMemo);
  }, [userMemo]);

  // 日時フォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    // 時刻は0埋めする
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

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
      <PopupEditor currentMemo={currentMemo} setCurrentMemo={setCurrentMemo} />
      <div className="memo__hover-box">
        <div className="memo__left-box"></div>
        <p className="memo__updatedAt">
          更新 {formatDate(currentMemo.updatedAt)}
        </p>
        <button
          className="memo__delete"
          onClick={() => handleDeleteMemo(currentMemo)}
        >
          <IconTooltip title="削除">
            <DeleteIcon sx={{ width: "1.8rem", height: "1.8rem" }} />
          </IconTooltip>
        </button>
      </div>
    </div>
  );
};

export default MemoRow;
