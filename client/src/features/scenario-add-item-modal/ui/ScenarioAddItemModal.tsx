import {
  WIDGET_DESCRIPTIONS,
  WIDGET_HUES,
  WIDGET_ICONS,
  WIDGET_LABELS,
} from '@/entities/scenario';
import type { ScenarioWidgetType } from '@shared/types/scenario';
import { Plus } from 'lucide-react';
import { ScenarioModal } from './ScenarioModal';
import { ContentTabs } from './ContentTabs';
import { FolderFilterTree } from './FolderFilterTree';
import { MediaGrid, MediaSelectionToolbar } from '@/shared/ui';
import { useScenarioAddItem, type Tab } from '../model/useScenarioAddItem';

interface ScenarioAddItemModalProps {
  open: boolean;
  onClose: () => void;
  kioskId: number;
}

export function ScenarioAddItemModal({
  open,
  onClose,
  kioskId,
}: ScenarioAddItemModalProps) {
  const {
    tab,
    setTab,
    selectedFolderId,
    setSelectedFolderId,
    selectedFiles,
    setSelectedFiles,
    folderTree,
    media,
    isLoading,
    handleAddWidget,
    handleAddSelected,
  } = useScenarioAddItem(kioskId, onClose);

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
        onChange={(v) => {
          setTab(v as Tab);
          setSelectedFiles(new Set());
        }}
        className="mb-5"
      />

      {tab === 'widget' && (
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(WIDGET_LABELS).map(([type, label]) => {
            const Icon = WIDGET_ICONS[type as ScenarioWidgetType];
            const hue = WIDGET_HUES[type as ScenarioWidgetType];

            return (
              <button
                key={type}
                type="button"
                onClick={() => handleAddWidget(type as ScenarioWidgetType)}
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
                  <div className="mt-1 text-xs leading-snug">
                    {WIDGET_DESCRIPTIONS[type as ScenarioWidgetType]}
                  </div>
                </div>

                <Plus
                  size={34}
                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </button>
            );
          })}
        </div>
      )}

      {tab === 'media' && (
        <div className="flex flex-row gap-4">
          <div className="w-64 shrink-0">
            <FolderFilterTree
              tree={folderTree}
              selectedId={selectedFolderId}
              onSelect={setSelectedFolderId}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <MediaSelectionToolbar
              mode="select"
              selectedCount={selectedFiles.size}
              onClearSelection={() => setSelectedFiles(new Set())}
              onAddToScenario={handleAddSelected}
              moveMode={false}
            />

            <MediaGrid
              media={media}
              isLoading={isLoading}
              selectedFiles={selectedFiles}
              onToggleSelect={(key) => {
                setSelectedFiles((prev) => {
                  const next = new Set(prev);
                  next.has(key) ? next.delete(key) : next.add(key);
                  return next;
                });
              }}
            />
          </div>
        </div>
      )}
    </ScenarioModal>
  );
}
