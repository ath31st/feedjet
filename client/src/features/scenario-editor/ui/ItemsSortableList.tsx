import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import type { ScenarioItem } from '@/entities/scenario';
import { ItemRow } from './ItemRow';
import { buildImageUrl } from '@/entities/image';
import { buildVideoUrl } from '@/entities/video';
import type { PreviewMediaState } from '..';

interface ItemsSortableListProps {
  items: ScenarioItem[];
  currentPlayingItemId: number | null;
  onItemsChange: React.Dispatch<React.SetStateAction<ScenarioItem[]>>;
  onDirtyChange: React.Dispatch<React.SetStateAction<boolean>>;
  onPreview: (payload: PreviewMediaState) => void;
}

export function ItemsSortableList({
  items,
  currentPlayingItemId,
  onItemsChange,
  onDirtyChange,
  onPreview,
}: ItemsSortableListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updated = Array.from(items);

    const [moved] = updated.splice(result.source.index, 1);

    updated.splice(result.destination.index, 0, moved);

    onItemsChange(updated);

    onDirtyChange(true);
  };

  const handleToggle = (item: ScenarioItem) => {
    onItemsChange((prev) =>
      prev.map((row) =>
        row.id === item.id ? { ...row, isActive: !row.isActive } : row,
      ),
    );
    onDirtyChange(true);
  };

  const handleDelete = (item: ScenarioItem) => {
    onItemsChange((prev) => prev.filter((row) => row.id !== item.id));
    onDirtyChange(true);
  };

  const handleDurationChange = (
    item: ScenarioItem,
    durationSeconds: number,
  ) => {
    onItemsChange((prev) =>
      prev.map((row) =>
        row.id === item.id ? { ...row, durationSeconds } : row,
      ),
    );
    onDirtyChange(true);
  };

  const openPreview = (item: ScenarioItem) => {
    if (item.type === 'image' && item.imageFileName) {
      onPreview({
        kind: 'image',
        src: buildImageUrl(item.imageFileName),
        name: item.imageName ?? item.imageFileName,
      });
    }

    if (item.type === 'video' && item.videoFileName) {
      onPreview({
        kind: 'video',
        src: buildVideoUrl(item.videoFileName),
        name: item.videoName ?? item.videoFileName,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="scenario-items">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col"
          >
            {items.map((item, index) => (
              <ItemRow
                key={item.id}
                item={item}
                index={index}
                isActive={currentPlayingItemId === item.id}
                onToggle={() => handleToggle(item)}
                onDelete={() => handleDelete(item)}
                onDurationChange={(v) => handleDurationChange(item, v)}
                onClick={() => {}}
                onPreview={() => openPreview(item)}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
