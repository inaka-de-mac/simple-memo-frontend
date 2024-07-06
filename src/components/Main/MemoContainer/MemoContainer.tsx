import React from "react";
import MemoTable from "./MemoTable";
import NewMemoRow from "./NewMemoRow";

const MemoContainer: React.VFC = () => {
  return (
    <div className="memo__table" data-testid="memo-container">
        <NewMemoRow />
        <MemoTable />
    </div>
  );
};

export default MemoContainer;
