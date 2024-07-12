import {
  Active,
  closestCorners,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  Over,
  UniqueIdentifier,
} from "@dnd-kit/core";

import { SortableColumn } from "./SortableColumn";
import { MemoCell } from "./SortableMemoCell";
import { useEffect, useState } from "react";
import { arrayMove, SortableData } from "@dnd-kit/sortable";
import { arrayInsert, arrayRemove } from "./SortableUtils";

type Items = UniqueIdentifier[];

const SortableContainer = (props: {
  initialItemsMap: Map<UniqueIdentifier, Items>;
}) => {
  const [itemsMap, setItemsMap] = useState(props.initialItemsMap);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  useEffect(() => {
    Array.from(itemsMap).map(([containerId, items]) => (
      console.log(containerId, items)
    ));
  }, [props.initialItemsMap]);

  const detectCollision: CollisionDetection = (args) => {
    const cornerCollisions = closestCorners(args);

    const closestContainer = cornerCollisions.find((c) => {
      return itemsMap.has(c.id);
    });

    if (typeof closestContainer === "undefined") {
      return cornerCollisions;
    }

    const collisions = cornerCollisions.filter(({ data }) => {
      if (typeof data === "undefined") {
        return false;
      }

      const droppableData = data.droppableContainer?.data?.current as
        | SortableData
        | undefined;
      if (typeof droppableData === "undefined") {
        return false;
      }

      const { containerId } = droppableData.sortable;

      return closestContainer.id === containerId;
    });

    if (collisions.length === 0) {
      return [closestContainer];
    }

    return collisions;
  };

  interface Data {
    containerId: UniqueIdentifier;
    items: Items;
    index: number;
  }

  const getFromData = (active: Active): Data => {
    const activeData = active.data.current as SortableData;
    return activeData.sortable;
  };

  const getToData = (over: Over): Data => {
    const items = itemsMap.get(over.id);
    if (typeof items === "undefined") {
      const overData = over.data.current as SortableData;
      return overData.sortable;
    } else {
      return {
        containerId: over.id,
        items,
        index: NaN,
      };
    }
  };

  const getData = (event: { active: Active; over: Over | null }) => {
    const { active, over } = event;
    if (over === null) {
      return null;
    }

    if (active.id === over.id) {
      return null;
    }

    return {
      from: getFromData(active),
      to: getToData(over),
    };
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const data = getData(event);
    if (data == null) {
      return;
    }

    const { from, to } = data;

    if (from.containerId === to.containerId) {
      return;
    }

    const item = from.items[from.index];

    const newFromItems = arrayRemove(from.items, from.index);
    const newToItems = arrayInsert(to.items, to.index, item);

    setItemsMap(
      new Map([
        ...itemsMap.entries(),
        [from.containerId, newFromItems],
        [to.containerId, newToItems],
      ])
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const data = getData(event);
    if (data == null) {
      return;
    }

    const { from, to } = data;

    const newFromItems = arrayMove(from.items, from.index, to.index);

    setItemsMap(
      new Map([...itemsMap.entries(), [from.containerId, newFromItems]])
    );
  };

  return (
    <div className="dnd__container">
      <DndContext
        collisionDetection={detectCollision}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Array.from(itemsMap).map(([containerId, items]) => (
          <SortableColumn
            key={containerId}
            containerId={containerId}
            items={items}
          />
        ))}
        <DragOverlay>
          {activeId === null ? null : <MemoCell id={activeId} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SortableContainer;
