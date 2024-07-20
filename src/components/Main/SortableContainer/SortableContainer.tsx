import {
  closestCorners,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import SortableItem from "./SortableItem";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemoContext } from "../../../context/MemoContext";

const SortableContainer = () => {
  const { userMemos, setUserMemos, editingMemoId, updateMemos } =
    useMemoContext();
  const sensors = useSensors(
    // ドラッグしないとソート処理が動かないように設定(編集可能になる)
    useSensor(PointerSensor, { activationConstraint: { distance: 0 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id) return; // 移動していない場合は何もしない

    // userMemosのindexを取得(=displayOrder≠)
    const activeIndex = userMemos.findIndex((memo) => memo.id === active.id);
    const overIndex = userMemos.findIndex((memo) => memo.id === over?.id);
    // userMemosの並び替え
    const sortedMemos = arrayMove(userMemos, activeIndex, overIndex);
    // displayOrderを再設定
    const newOriginalMemos = sortedMemos.map((memo, index) => {
      return { ...memo, displayOrder: index + 1 }; // 1始まりにするため
    });
    setUserMemos(newOriginalMemos); // 状態更新
    updateMemos(newOriginalMemos); // DB更新
  };

  return (
    <div className="dnd__container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={userMemos}
          strategy={verticalListSortingStrategy}
        >
          {userMemos.length > 0 ? (
            userMemos.map((memo) => (
              <SortableItem
                key={memo.id}
                memo={memo}
                isDisabled={memo.id === editingMemoId} // 編集中のメモを移動不可に
              />
            ))
          ) : (
            <p className="dnd__empty-message">No memos</p>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SortableContainer;
