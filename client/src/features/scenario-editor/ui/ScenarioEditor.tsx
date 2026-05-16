import {
  useDeleteScenarioItem,
  useReorderScenarioItems,
  useUpdateScenarioItem,
} from '@/entities/scenario';
import type { ScenarioItem } from '@/entities/scenario';
import { Header } from './Header';
import { LoadingState } from './LoadingState';
import { ItemsSortableList } from './ItemsSortableList';
import { EmptyState } from './EmptyState';

interface LightboxState {
  src: string;
  name: string;
  kind: 'image' | 'video';
}

interface ScenarioEditorProps {
  kioskId: number;
  items: ScenarioItem[];
  isDirty: boolean;
  isLoading: boolean;
  currentPlayingItemId: number | null;
  onItemsChange: React.Dispatch<React.SetStateAction<ScenarioItem[]>>;
  onDirtyChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
  onReset: () => void;
  onOpenAddModal: () => void;
  onPreview: (payload: LightboxState) => void;
}

export function ScenarioEditor({
  kioskId,
  items,
  isDirty,
  isLoading,
  currentPlayingItemId,
  onItemsChange,
  onDirtyChange,
  onSave,
  onReset,
  onOpenAddModal,
  onPreview,
}: ScenarioEditorProps) {
  const updateItem = useUpdateScenarioItem(kioskId);
  const deleteItem = useDeleteScenarioItem(kioskId);
  const reorder = useReorderScenarioItems(kioskId);

  return (
    <div className="flex flex-col">
      <Header
        isDirty={isDirty}
        onAdd={onOpenAddModal}
        onSave={onSave}
        onReset={onReset}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <ItemsSortableList
            kioskId={kioskId}
            items={items}
            currentPlayingItemId={currentPlayingItemId}
            reorder={reorder}
            updateItem={updateItem}
            deleteItem={deleteItem}
            onItemsChange={onItemsChange}
            onDirtyChange={onDirtyChange}
            onPreview={onPreview}
          />
        )}
      </div>
    </div>
  );
}
