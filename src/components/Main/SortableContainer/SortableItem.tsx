import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Memo } from "../../../Types";
import MemoRow from "../MemoContainer/MemoRow";

const SortableItem = (props: { memo: Memo, isDisabled: boolean }) => {
  const { memo, isDisabled } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: memo.id, disabled: isDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : "auto", // ドラッグ中の要素に高い z-index を設定
    cursor: isDisabled ? "auto" : (isDragging ? "grabbing" : "grab"), // ドラッグ中のカーソルを掴むアイコンに設定
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MemoRow originalMemo={memo} key={memo.id} />
    </div>
  );
};

export default SortableItem;
