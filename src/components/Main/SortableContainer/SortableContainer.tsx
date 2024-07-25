import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
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
import { useState } from "react";

const SortableContainer = () => {
  const { userMemos, setUserMemos, editingMemoId, updateMemos } =
    useMemoContext();
  const sensors = useSensors(
    // ドラッグしないとソート処理が動かないように設定(編集可能になる)
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const [activeId, setActiveId] = useState(-1);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(-1); // ドラッグ終了後、activeIdをリセット
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
        onDragStart={({ active }) => setActiveId(Number(active.id))}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={userMemos}
          strategy={verticalListSortingStrategy}
        >
          {userMemos.length > 0 ? (
            userMemos.map((userMemo) => (
              <SortableItem
                key={userMemo.id}
                userMemo={userMemo}
                isDisabled={userMemo.id === editingMemoId} // 編集中のメモを移動不可に
                isTransparent={activeId === userMemo.id} // activeIdが一致する場合に透明度を変更
              />
            ))
          ) : (
            <p className="dnd__empty-message">No memos</p>
          )}
        </SortableContext>
        {/* ユーザーがドラッグしている要素を表示 */}
        <DragOverlay>
          {activeId ? (
            <SortableItem
              userMemo={userMemos.find((userMemo) => userMemo.id === activeId)}
              isDisabled={false} // true/falseどちらでもいい
              isTransparent={false} // ドラッグ対象のためactiveだけど透明にしない
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SortableContainer;
