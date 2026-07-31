import { Plus } from 'lucide-react';
import { ScenarioModal } from './ScenarioModal';
import { ContentTabs } from './ContentTabs';
import { FolderFilterTree } from './FolderFilterTree';
import { MediaGrid, MediaSelectionToolbar } from '@/shared/ui';
import { useScenarioAddItem, type Tab } from '../model/useScenarioAddItem';
import type { ScenarioItem } from '@/entities/scenario';

interface ScenarioAddItemModalProps {
  open: boolean;
  onClose: () => void;
  onAddItems: (items: ScenarioItem[]) => void;
}

export function ScenarioAddItemModal({
  open,
  onClose,
  onAddItems,
}: ScenarioAddItemModalProps) {
  const {
    tab,
    handleTabChange,
    selectedFolderId,
    handleSelectFolder,
    selectedFiles,
    handleToggleSelect,
    handleClearSelection,
    folderTree,
    media,
    childFolders,
    isLoading,
    widgetOptions,
    handleAddWidget,
    handleAddSelected,
  } = useScenarioAddItem(onAddItems, onClose);

  return (
    <ScenarioModal
      open={open}
      onClose={onClose}
      title="Добавить элемент в сценарий"
      size="full"
    >
      <ContentTabs
        tabs={[
          { value: 'widget', label: 'Виджеты' },
          { value: 'media', label: 'Медиа' },
        ]}
        value={tab}
        onChange={(v) => handleTabChange(v as Tab)}
        className="mb-5"
      />

      {tab === 'widget' && (
        <div className="grid grid-cols-2 gap-3">
          {widgetOptions.map(({ type, label, description, hue, Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAddWidget(type)}
              className="group flex items-center gap-4 rounded-xl border border-(--border) p-4 text-left transition-all hover:border-(--border) hover:bg-(--button-hover-bg)"
            >
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg text-white"
                style={{
                  background: `linear-gradient(135deg, hsl(${hue},65%,55%), hsl(${(hue + 40) % 360},70%,40%))`,
                }}
              >
                <Icon size={44} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm">{label}</div>
                <div className="mt-1 text-xs leading-snug">{description}</div>
              </div>

              <Plus
                size={34}
                className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </button>
          ))}
        </div>
      )}

      {tab === 'media' && (
        <div className="flex flex-row gap-4">
          <div className="w-64 shrink-0">
            <FolderFilterTree
              tree={folderTree}
              selectedId={selectedFolderId}
              onSelect={handleSelectFolder}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div
              className={`flex items-center justify-end px-2 transition-all duration-300 ease-in-out ${
                selectedFiles.size > 0
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-full opacity-0'
              }`}
            >
              <MediaSelectionToolbar
                mode="select"
                selectedCount={selectedFiles.size}
                onClearSelection={handleClearSelection}
                onAddToScenario={handleAddSelected}
                moveMode={false}
              />
            </div>

            <MediaGrid
              media={media}
              isLoading={isLoading}
              folders={childFolders}
              onOpenFolder={handleSelectFolder}
              selectedFiles={selectedFiles}
              onToggleSelect={handleToggleSelect}
            />
          </div>
        </div>
      )}
    </ScenarioModal>
  );
}
