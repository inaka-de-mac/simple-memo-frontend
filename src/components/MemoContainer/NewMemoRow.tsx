import React from "react";
import "../../App.css";
import { useMemoContext } from "../../context/MemoContext";

const NewMemoRow: React.VFC = () => {
  const {
    currentMemos,
    newMemo,
    setNewMemo,
    handleMemoUpdate,
    handleRowClick,
    handleKeyDown,
    textareaRefs,
  } = useMemoContext();
  return (
    <tr
      className="memo__row"
      onClick={() => handleRowClick(currentMemos.length)}
      data-testid="new-memo-row"
    >
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
          data-testid="new-memo-textarea"
        />
      </td>
      <td className="memo__updatedAt"></td>
      <td>
        <button className="memo__delete"></button>
      </td>
    </tr>
  );
};

export default NewMemoRow;
