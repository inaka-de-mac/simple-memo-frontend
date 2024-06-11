import React from "react";
import { MemoRowProps } from "../../Types";
import "../../App.css";
import DeleteIcon from "@mui/icons-material/Delete";

const MemoRow: React.VFC<MemoRowProps> = ({
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

export default MemoRow;
