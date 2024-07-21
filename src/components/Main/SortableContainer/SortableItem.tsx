import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Memo } from "../../../Types";
import MemoRow from "../MemoContainer/MemoRow";
import { Opacity } from "@mui/icons-material";

const SortableItem = (props: {
  memo: Memo | undefined;
  isDisabled: boolean;
  isTransparent: boolean;
}) => {
  const { memo, isDisabled, isTransparent } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: memo!.id, disabled: isDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDisabled ? "auto" : isDragging ? "grabbing" : "grab", // ドラッグ中のカーソルを掴むアイコンに設定
    opacity: isTransparent ? 0 : 1, // ドラッグ中の要素を透明に
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MemoRow originalMemo={memo!} key={memo!.id} />
    </div>
  );
};

export default SortableItem;
