import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import type {
  ScenarioItem,
  useDeleteScenarioItem,
  useReorderScenarioItems,
  useUpdateScenarioItem,
} from '@/entities/scenario';
import { ItemRow } from './ItemRow';
import { buildImageUrl } from '@/entities/image';
import { buildVideoUrl } from '@/entities/video';
import type { PreviewMediaState } from '..';

interface ItemsSortableListProps {
  kioskId: number;
  items: ScenarioItem[];
  currentPlayingItemId: number | null;
  reorder: ReturnType<typeof useReorderScenarioItems>;
  updateItem: ReturnType<typeof useUpdateScenarioItem>;
  deleteItem: ReturnType<typeof useDeleteScenarioItem>;
  onItemsChange: React.Dispatch<React.SetStateAction<ScenarioItem[]>>;
  onDirtyChange: React.Dispatch<React.SetStateAction<boolean>>;
  onPreview: (payload: PreviewMediaState) => void;
}

export function ItemsSortableList({
  kioskId,
  items,
  currentPlayingItemId,
  updateItem,
  deleteItem,
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
    updateItem.mutate({
      kioskId,
      itemId: item.id,
      patch: {
        isActive: !item.isActive,
      },
    });
  };

  const handleDelete = (item: ScenarioItem) => {
    deleteItem.mutate({
      kioskId,
      itemId: item.id,
    });
  };

  const handleDurationChange = (
    item: ScenarioItem,
    durationSeconds: number,
  ) => {
    updateItem.mutate({
      kioskId,
      itemId: item.id,
      patch: {
        durationSeconds,
      },
    });
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
            className="flex flex-col gap-2"
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
