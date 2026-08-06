import type { ScenarioItem } from '@/entities/scenario';
import { ScenarioItemsSkeleton } from '@/shared/ui';
import { ItemsSortableList } from './ItemsSortableList';
import { EmptyState } from './EmptyState';
import { Header } from './Header';

interface LightboxState {
  src: string;
  name: string;
  kind: 'image' | 'video';
}

interface ScenarioEditorProps {
  items: ScenarioItem[];
  isDirty: boolean;
  isLoading: boolean;
  isCopyMode: boolean;
  currentPlayingItemId: number | null;
  onItemsChange: React.Dispatch<React.SetStateAction<ScenarioItem[]>>;
  onDirtyChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
  onReset: () => void;
  onDeleteAll: () => void;
  onToggleCopyMode: () => void;
  onOpenAddModal: () => void;
  onPreview: (payload: LightboxState) => void;
}

export function ScenarioEditor({
  items,
  isDirty,
  isLoading,
  isCopyMode,
  currentPlayingItemId,
  onItemsChange,
  onDirtyChange,
  onSave,
  onReset,
  onDeleteAll,
  onToggleCopyMode,
  onOpenAddModal,
  onPreview,
}: ScenarioEditorProps) {
  return (
    <div className="flex flex-col">
      <Header
        isDirty={isDirty}
        hasItems={items.length > 0}
        isCopyMode={isCopyMode}
        onAdd={onOpenAddModal}
        onSave={onSave}
        onReset={onReset}
        onDeleteAll={onDeleteAll}
        onToggleCopyMode={onToggleCopyMode}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <ScenarioItemsSkeleton />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <ItemsSortableList
            items={items}
            currentPlayingItemId={currentPlayingItemId}
            onItemsChange={onItemsChange}
            onDirtyChange={onDirtyChange}
            onPreview={onPreview}
          />
        )}
      </div>
    </div>
  );
}
