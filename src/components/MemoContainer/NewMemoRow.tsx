import React from "react";
import { Memo } from "../../Types";
import "../../App.css";

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

export default NewMemoRow;
