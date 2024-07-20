import React from "react";
import NewMemoRow from "./NewMemoRow";
import SortableContainer from "../SortableContainer/SortableContainer";

const MemoContainer: React.VFC = () => {
  return (
    <div className="memo__table" data-testid="memo-container">
        <NewMemoRow />
        <SortableContainer />

    </div>
  );
};

export default MemoContainer;
