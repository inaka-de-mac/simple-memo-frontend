import React from "react";
import { useMemoContext } from "../../../context/MemoContext";
import AddIcon from "@mui/icons-material/Add";

const NewMemoRow: React.VFC = () => {
  const { handleCreateMemo } = useMemoContext();
  return (
    <div
      className="memo__row new-memo__row"
      onClick={handleCreateMemo}
    >
      <AddIcon />
      <p className="new-memo__text">メモを作成</p>
    </div>
  );
};

export default NewMemoRow;
