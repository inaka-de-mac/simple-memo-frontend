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
  const { originalMemos, setOriginalMemos, editingMemoId, updateMemos } =
    useMemoContext();
  const sensors = useSensors(
    // ドラッグしないとソート処理が動かないように設定(編集可能になる)
    useSensor(PointerSensor, { activationConstraint: { distance: 0 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const activeMemoIndex = originalMemos.findIndex(
        (memo) => memo.id === active.id
      );
      const overMemoIndex = originalMemos.findIndex(
        (memo) => memo.id === over?.id
      );

      const sortedMemos = arrayMove(
        originalMemos,
        activeMemoIndex,
        overMemoIndex
      );

      const newOriginalMemos = sortedMemos.map((memo, index) => {
        return { ...memo, displayOrder: index + 1 };
      });

      setOriginalMemos(newOriginalMemos);

      // POST
      updateMemos(newOriginalMemos);
    }
  };

  return (
    <div className="dnd__container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={originalMemos}
          strategy={verticalListSortingStrategy}
        >
          {originalMemos.length > 0 ? (
            originalMemos.map((memo) => (
              <SortableItem
                key={memo.id}
                memo={memo}
                isDisabled={memo.id === editingMemoId} // 編集中のメモは移動不可 
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
