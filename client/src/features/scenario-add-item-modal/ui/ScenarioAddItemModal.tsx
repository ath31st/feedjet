/** biome-ignore-all lint/a11y: disable all a11y rules */
import { useAddScenarioItem } from '@/entities/scenario';
import { trpcWithProxy } from '@/shared/api';
import { SERVER_URL } from '@/shared/config';
import { fmtBytes, fmtDuration } from '@/shared/lib';
import type {
  ScenarioWidgetType,
  ScenarioItemType,
} from '@shared/types/scenario';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { ScenarioModal } from './ScenarioModal';
import { ContentTabs } from './ContentTabs';
import { cn } from './cn';
import { WIDGET_ICONS, WIDGET_LABELS } from '@/entities/scenario';

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
  const { data: allImages = [] } = useQuery(
    trpcWithProxy.image.listAllFiles.queryOptions(),
  );
  const { data: allVideos = [] } = useQuery(
    trpcWithProxy.videoFile.listAllFiles.queryOptions(),
  );
  const { data: folderTree = [] } = useQuery(
    trpcWithProxy.mediaFolder.getTree.queryOptions(),
  );

  const flatFolders = useMemo(() => {
    const out: Array<{ id: number; name: string; depth: number }> = [];
    const walk = (
      nodes: Array<{
        id: number;
        name: string;
        children: typeof nodes;
      }>,
      depth: number,
    ) => {
      for (const n of nodes) {
        out.push({ id: n.id, name: n.name, depth });
        walk(n.children, depth + 1);
      }
    };
    walk(folderTree as never, 0);
    return out;
  }, [folderTree]);

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
          toast.success('Виджет добавлен');
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
          toast.success('Изображение добавлено');
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
          toast.success('Видео добавлено');
          onClose();
        },
      },
    );
  };

  return (
    <AddItemModalContent
      open={open}
      onClose={onClose}
      tab={tab}
      setTab={setTab}
      folderFilter={folderFilter}
      setFolderFilter={setFolderFilter}
      flatFolders={flatFolders}
      allImages={allImages}
      allVideos={allVideos}
      filteredImages={filteredImages}
      filteredVideos={filteredVideos}
      handleAddWidget={handleAddWidget}
      handleAddImage={handleAddImage}
      handleAddVideo={handleAddVideo}
    />
  );
}

interface AddItemModalContentProps {
  open: boolean;
  onClose: () => void;
  tab: ScenarioItemType;
  setTab: (t: ScenarioItemType) => void;
  folderFilter: number | null;
  setFolderFilter: (id: number | null) => void;
  flatFolders: Array<{ id: number; name: string; depth: number }>;
  allImages: Array<{
    id: number;
    name: string;
    thumbnail: string;
    size: number;
    width: number;
    height: number;
    folderId: number | null;
  }>;
  allVideos: Array<{
    id: number;
    name: string;
    fileName: string;
    duration: number;
    size: number;
    folderId: number | null;
  }>;
  filteredImages: Array<{
    id: number;
    name: string;
    thumbnail: string;
    size: number;
    width: number;
    height: number;
    folderId: number | null;
  }>;
  filteredVideos: Array<{
    id: number;
    name: string;
    fileName: string;
    duration: number;
    size: number;
    folderId: number | null;
  }>;
  handleAddWidget: (type: ScenarioWidgetType) => void;
  handleAddImage: (id: number) => void;
  handleAddVideo: (id: number) => void;
}

const WIDGET_DESCRIPTIONS: Record<ScenarioWidgetType, string> = {
  birthday: 'Поздравления сотрудников по списку',
  rss: 'Заголовки из RSS-источников',
  schedule: 'Расписание мероприятий',
  info: 'Часы, дата и прогноз погоды на 7 дней',
};

const WIDGET_HUES: Record<ScenarioWidgetType, number> = {
  birthday: 320,
  rss: 0,
  schedule: 140,
  info: 200,
};

function AddItemModalContent({
  open,
  onClose,
  tab,
  setTab,
  folderFilter,
  setFolderFilter,
  flatFolders,
  allImages,
  allVideos,
  filteredImages,
  filteredVideos,
  handleAddWidget,
  handleAddImage,
  handleAddVideo,
}: AddItemModalContentProps) {
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
                className="group flex items-center gap-4 rounded-xl border border-(--border) transition-allhover:border-(--border) p-4 text-left hover:bg-(--button-hover-bg)"
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
                  <div className={cn('font-semibold text-sm')}>{label}</div>
                  <div className={cn('mt-1 text-xs leading-snug')}>
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
        <>
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <span className={cn('mr-1 font-medium text-xs')}>Папка:</span>
            <button
              type="button"
              onClick={() => setFolderFilter(null)}
              className={cn(
                'h-8 rounded-md border px-3 text-xs transition-colors',
                folderFilter === null
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                  : cn(),
              )}
            >
              Все файлы
            </button>
            {flatFolders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFolderFilter(f.id)}
                className={cn(
                  'h-8 rounded-md border px-3 text-xs transition-colors',
                  folderFilter === f.id
                    ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                    : cn(),
                )}
                style={{ paddingLeft: `${12 + f.depth * 8}px` }}
              >
                {'/ '.repeat(f.depth)}
                {f.name}
              </button>
            ))}
          </div>

          {tab === 'image' &&
            (filteredImages.length === 0 ? (
              <div
                className={cn(
                  'rounded-lg border border-dashed py-12 text-center text-sm',
                )}
              >
                {allImages.length === 0
                  ? 'Нет изображений в медиа-библиотеке'
                  : 'В выбранной папке нет изображений'}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {filteredImages.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => handleAddImage(img.id)}
                    className={cn(
                      'group overflow-hidden rounded-lg border text-left transition-all',

                      'hover:border-blue-500 hover:shadow-lg',
                    )}
                  >
                    <div className="relative aspect-video overflow-hidden bg-black">
                      <img
                        src={`${SERVER_URL}/images/${img.thumbnail}`}
                        alt={img.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-black/60 via-transparent to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <Plus
                          size={20}
                          className="rounded-full bg-blue-500 p-1 text-white shadow-lg"
                        />
                      </div>
                    </div>
                    <div className="p-2">
                      <div
                        className={cn('truncate font-medium text-xs')}
                        title={img.name}
                      >
                        {img.name}
                      </div>
                      <div
                        className={cn(
                          'mt-0.5 flex items-center justify-between font-mono text-[10px]',
                        )}
                      >
                        <span>
                          {img.width}×{img.height}
                        </span>
                        <span>{fmtBytes(img.size)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}

          {tab === 'video' &&
            (filteredVideos.length === 0 ? (
              <div
                className={cn(
                  'rounded-lg border border-dashed py-12 text-center text-sm',
                )}
              >
                {allVideos.length === 0
                  ? 'Нет видео в медиа-библиотеке'
                  : 'В выбранной папке нет видео'}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {filteredVideos.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleAddVideo(v.id)}
                    className={cn(
                      'group overflow-hidden rounded-lg border text-left transition-all',

                      'hover:border-blue-500 hover:shadow-lg',
                    )}
                  >
                    <div className="relative aspect-video overflow-hidden bg-black">
                      <video
                        src={`${SERVER_URL}/videos/${v.fileName}`}
                        muted
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
                        {fmtDuration(v.duration)}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <Plus
                          size={28}
                          className="rounded-full bg-blue-500 p-1.5 text-white shadow-lg"
                        />
                      </div>
                    </div>
                    <div className="p-2">
                      <div
                        className={cn('truncate font-medium text-xs')}
                        title={v.name}
                      >
                        {v.name}
                      </div>
                      <div className={cn('mt-0.5 font-mono text-[10px]')}>
                        {fmtBytes(v.size)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
        </>
      )}
    </ScenarioModal>
  );
}
