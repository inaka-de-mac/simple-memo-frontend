import React from "react";
import { MemoTableProps } from "../../Types";
import "../../App.css";
import MemoRow from "./MemoRow";

const MemoTable: React.VFC<MemoTableProps> = ({
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
