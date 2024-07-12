import React from "react";
import MemoRow from "./MemoRow";
import { useMemoContext } from "../../../context/MemoContext";
import { Memo } from "../../../Types";
import SortableContainer from "../SortableContainer/SortableContainer";

const MemoTable: React.VFC = () => {
  const { originalMemos } = useMemoContext();
  return (
    <>
      {originalMemos &&
        originalMemos.map((originalMemo: Memo) => (
          <MemoRow originalMemo={originalMemo} key={originalMemo.id} />
        ))}
        {/* Container > Row > Group > Cell */}
      <SortableContainer
        initialItemsMap={
          new Map([
            ["items0", ["101", 102]],
            ["items1", [103, 104]],
            ["items2", [105, 106, ]],
            ["items3", [107, 108]],
          ])
        }
      />
    </>
  );
};

export default MemoTable;
