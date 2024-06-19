import React from "react";
import "../../App.css";
import MemoRow from "./MemoRow";
import { useMemoContext } from "../../context/MemoContext";

const MemoTable: React.VFC = () => {
  const {currentMemos} = useMemoContext();
  return (
    <>
      {currentMemos.map((memo, tableId) => (
        <MemoRow
          memo={memo}
          tableId={tableId}
          key={memo.id}
        />
      ))}
    </>
  );
};

export default MemoTable;
