import React, { useRef, useState } from "react";
import { useMemoContext } from "../../../context/MemoContext";
import { Memo } from "../../../Types";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";

const NewMemoRow: React.VFC = () => {
  const {
    handleTitleKeyDown,
    handleContentKeyDown,
    handleRowClick,
    newMemo,
    setNewMemo,
  } = useMemoContext();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      className="memo__row"
      data-testid="new-memo-row"
      onClick={(e) => handleRowClick(e, -1)}
    >
      <input
        type="text"
        className="memo__form memo__form--title"
        value={newMemo.title}
        placeholder="Enter Title"
        onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
        onKeyDown={(e) => handleTitleKeyDown(e, titleRef, contentRef, newMemo!)}
        ref={titleRef}
      />
      <textarea
        className="memo__form memo__form--content"
        value={newMemo.content}
        placeholder="Enter Content"
        onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
        data-testid="new-memo-textarea"
        onKeyDown={(e) =>
          handleContentKeyDown(e, titleRef, contentRef, newMemo!)
        }
        ref={contentRef}
      />
    </div>
  );
};

export default NewMemoRow;
