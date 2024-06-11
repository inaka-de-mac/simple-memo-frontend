import React from "react";
import { NewMemoRowProps } from "../../Types";
import "../../App.css";

const NewMemoRow: React.VFC<NewMemoRowProps> = ({
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
