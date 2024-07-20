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
      onClick={(e) => handleRowClick(e, titleRef)}
      onBlur={() => {
        console.log("memo__row onBlur");
      }}
    >
      <input
        type="text"
        className="memo__form memo__form--title"
        value={newMemo.title}
        placeholder="Enter Title"
        onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
        onKeyDown={(e) => handleTitleKeyDown(e, titleRef, contentRef, newMemo!)}
        onBlur={() => {
          console.log("memo__form--title onBlur");
        }}
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
        onBlur={() => {
          console.log("memo__form--content onBlur");
        }}
        ref={contentRef}
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
      </div>
    </div>
  );
};

export default NewMemoRow;
