import React from "react";
import { Memo } from "../../Types";
import "../../App.css";
import MemoRow from "./MemoRow";

const MemoTable: React.FC<{
  currentMemos: Memo[];
  handleRowClick: (tableId: number) => void;
  handleMemoUpdate: (memo: Memo) => void;
  handleKeyDown: (e: React.KeyboardEvent, targetMemo: Memo, tableId: number) => void;
  handleMemoDelete: (id: number) => void;
  handleMemoEdit: (e: React.ChangeEvent<HTMLTextAreaElement>, id: number) => void;
  textareaRefs: React.MutableRefObject<HTMLTextAreaElement[]>;
}> = ({
  currentMemos,
  handleRowClick,
  handleMemoUpdate,
  handleKeyDown,
  handleMemoDelete,
  handleMemoEdit,
  textareaRefs,
}) => {
  return (
    <>
      {currentMemos.map((memo, tableId) => (
        <MemoRow
          memo={memo}
          tableId={tableId}
          key={memo.id}
          handleRowClick={handleRowClick}
          handleMemoUpdate={handleMemoUpdate}
          handleKeyDown={handleKeyDown}
          handleMemoDelete={handleMemoDelete}
          handleMemoEdit={handleMemoEdit}
          textareaRefs={textareaRefs}
        />
      ))}
    </>
  );
};

export default MemoTable;
