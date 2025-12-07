import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';

interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => string;
  onReorder: (newItems: T[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: types for dnd can be any
  children: (item: T, index: number, dragProps: any) => React.ReactNode;
  className?: string;
}

export function DndSortableList<T>({
  items,
  getId,
  onReorder,
  children,
  className = '',
}: SortableListProps<T>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);

    onReorder(newItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sortable-list">
        {(provided) => (
          <div
            className={className}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, idx) => {
              const id = getId(item);

              return (
                <Draggable key={id} draggableId={id} index={idx}>
                  {(p, snap) =>
                    children(item, idx, {
                      ref: p.innerRef,
                      dragHandleProps: p.dragHandleProps,
                      draggableProps: p.draggableProps,
                      isDragging: snap.isDragging,
                    })
                  }
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
