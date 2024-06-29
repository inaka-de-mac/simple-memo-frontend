import React from "react";
import "../../../App.css";
import MemoTable from "./MemoTable";
import NewMemoRow from "./NewMemoRow";

const MemoContainer: React.VFC = () => {
  return (
    <table className="memo__table" data-testid="memo-container">
      {/* <tbody>
        <MemoTable />
        <NewMemoRow />
      </tbody> */}
    </table>
  );
};

export default MemoContainer;
