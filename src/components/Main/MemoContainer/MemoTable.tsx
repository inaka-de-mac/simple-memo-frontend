import React from "react";
import MemoRow from "./MemoRow";
import { useMemoContext } from "../../../context/MemoContext";
import { Memo } from "../../../Types";

const MemoTable: React.VFC = () => {
  const { originalMemos } = useMemoContext();
  return (
    <>
      {originalMemos.map((originalMemo: Memo) => (
        <MemoRow originalMemo={originalMemo} key={originalMemo.id} />
      ))}
    </>
  );
};

export default MemoTable;
