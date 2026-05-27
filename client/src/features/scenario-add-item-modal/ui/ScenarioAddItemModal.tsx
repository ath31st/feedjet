import {
  useAddScenarioItem,
  WIDGET_DESCRIPTIONS,
  WIDGET_HUES,
  WIDGET_ICONS,
  WIDGET_LABELS,
} from '@/entities/scenario';
import type {
  ScenarioWidgetType,
  ScenarioItemType,
} from '@shared/types/scenario';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ScenarioModal } from './ScenarioModal';
import { ContentTabs } from './ContentTabs';
import { useMediaFolderTree } from '@/entities/media-folder';
import { useAllVideoList } from '@/entities/video';
import { useAllImageList } from '@/entities/image';
import { VideoGrid } from './VideoGrid';
import { ImageGrid } from './ImageGrid';
import { FolderFilterTree } from './FolderFilterTree';

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
  const [tab, setTab] = useState<ScenarioItemType>('widget');
  const [folderFilter, setFolderFilter] = useState<number | null>(null);
  const addItem = useAddScenarioItem(kioskId);
  const { data: allImages = [] } = useAllImageList();
  const { data: allVideos = [] } = useAllVideoList();
  const { data: folderTree = [] } = useMediaFolderTree();

  const filteredImages = allImages.filter((i) =>
    folderFilter === null ? true : i.folderId === folderFilter,
  );
  const filteredVideos = allVideos.filter((v) =>
    folderFilter === null ? true : v.folderId === folderFilter,
  );

  const handleAddWidget = (widgetType: ScenarioWidgetType) => {
    addItem.mutate(
      {
        kioskId,
        item: {
          type: 'widget',
          widgetType,
          order: 0,
          isActive: true,
          durationSeconds: 15,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleAddImage = (imageId: number) => {
    addItem.mutate(
      {
        kioskId,
        item: {
          type: 'image',
          imageId,
          order: 0,
          isActive: true,
          durationSeconds: 10,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleAddVideo = (videoId: number) => {
    addItem.mutate(
      { kioskId, item: { type: 'video', videoId, order: 0, isActive: true } },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <ScenarioModal
      open={open}
      onClose={onClose}
      title="Добавить элемент в сценарий"
      size="full"
    >
      <ContentTabs
        tabs={[
          { value: 'widget', label: 'Виджет' },
          { value: 'image', label: 'Изображение' },
          { value: 'video', label: 'Видео' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as ScenarioItemType)}
        className="mb-5"
      />

      {tab === 'widget' && (
        <div className="grid grid-cols-2 gap-3">
          {(
            Object.entries(WIDGET_LABELS) as [ScenarioWidgetType, string][]
          ).map(([type, label]) => {
            const Icon = WIDGET_ICONS[type];
            const hue = WIDGET_HUES[type];
            return (
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
                  <div className="mt-1 text-xs leading-snug">
                    {WIDGET_DESCRIPTIONS[type]}
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

      {(tab === 'image' || tab === 'video') && (
        <div className="flex flex-row gap-4">
          <div className="w-64 shrink-0">
            <FolderFilterTree
              tree={folderTree}
              selectedId={folderFilter}
              onSelect={setFolderFilter}
            />
          </div>

          <div className="min-w-0 flex-1">
            {tab === 'image' && (
              <ImageGrid
                allImages={allImages}
                filteredImages={filteredImages}
                onAddImage={handleAddImage}
              />
            )}

            {tab === 'video' && (
              <VideoGrid
                allVideos={allVideos}
                filteredVideos={filteredVideos}
                onAddVideo={handleAddVideo}
              />
            )}
          </div>
        </div>
      )}
    </ScenarioModal>
  );
}
