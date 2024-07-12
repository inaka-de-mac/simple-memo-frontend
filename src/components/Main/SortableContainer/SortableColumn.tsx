import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableMemoCell } from "./SortableMemoCell";

export const SortableColumn = (props: {
  containerId: UniqueIdentifier;
  items: UniqueIdentifier[];
}) => {
  const { setNodeRef } = useDroppable({
    id: props.containerId,
  });

  return (
    <SortableContext
      id={String(props.containerId)}
      items={props.items}
      strategy={verticalListSortingStrategy}
    >
      <div className="memo__group" ref={setNodeRef}>
        {props.items.map((id) => (
          <SortableMemoCell key={id} itemId={id} />
        ))}
      </div>
    </SortableContext>
  );
};
