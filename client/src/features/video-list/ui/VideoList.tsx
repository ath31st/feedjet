import { formatBytes } from '@/shared/lib';
import { Cross1Icon, EyeOpenIcon } from '@radix-ui/react-icons';
import { VideoPreviewDialog } from './VideoPreviewDialog';
import { formatDuration } from '@/shared/lib/formatDuration';
import { IconButton } from '@/shared/ui/common';
import * as Switch from '@radix-ui/react-switch';
import { useVideoList } from '../model/useVideoList';
import { DndSortableList } from '@/shared/ui';
import type { AdminVideoInfo } from '@/entities/video';

interface VideoListProps {
  kioskId: number;
}

export function VideoList({ kioskId }: VideoListProps) {
  const {
    ordered,
    isLoading,
    isRemoving,
    isUpdatingActive,
    handleRemoveVideo,
    handleToggleActive,
    handleReorder,
    setOpenVideo,
    openVideo,
  } = useVideoList(kioskId);

  if (isLoading) {
    return <div className="w-full text-(--meta-text) text-sm">Загрузка...</div>;
  }

  if (!ordered.length) {
    return (
      <div className="text-(--meta-text) text-sm">Нет загруженных видео</div>
    );
  }

  return (
    <>
      <DndSortableList<AdminVideoInfo>
        items={ordered}
        getId={(v) => v.fileName}
        onReorder={handleReorder}
        className="flex flex-col gap-2"
      >
        {(v, _, drag) => (
          <div
            ref={drag.ref}
            {...drag.draggableProps}
            {...drag.dragHandleProps}
            className={`flex cursor-grab items-center gap-2 rounded-lg border ${v.isActive ? 'border-(--border)' : 'border-(--border-disabled)'} p-1 ${
              drag.isDragging ? 'opacity-70 shadow-lg' : ''
            }`}
          >
            <div
              key={v.fileName}
              className="flex w-full items-center justify-between p-1"
            >
              <div className="flex flex-col overflow-hidden">
                <div className="flex flex-col overflow-hidden text-(--meta-text) text-xs">
                  <span className="truncate text-(--text) text-sm">
                    {v.name}
                  </span>

                  <div className="flex flex-row gap-10">
                    <div className="flex flex-col">
                      <span>
                        Разрешение: {v.width}x{v.height}px
                      </span>
                      <span>Формат: {v.format}</span>
                    </div>
                    <div className="flex flex-col">
                      <span>Размер: {formatBytes(v.size)}</span>
                      <span>
                        Дата загрузки:{' '}
                        {new Date(v.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>Длительность: {formatDuration(v.duration)}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                <Switch.Root
                  checked={v.isActive ?? false}
                  disabled={isUpdatingActive}
                  onCheckedChange={(checked) =>
                    handleToggleActive(v.fileName, checked)
                  }
                  className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-(--border) transition-colors data-[state=checked]:bg-(--button-bg)"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-(--text) transition-transform data-[state=checked]:translate-x-[21px]" />
                </Switch.Root>

                <IconButton
                  disabled={isLoading}
                  onClick={() => setOpenVideo(v)}
                  tooltip="Открыть видео"
                  icon={<EyeOpenIcon className="h-4 w-4 cursor-pointer" />}
                />

                <IconButton
                  disabled={isRemoving}
                  onClick={() => handleRemoveVideo(v.fileName)}
                  tooltip="Удалить видео"
                  icon={<Cross1Icon className="h-4 w-4 cursor-pointer" />}
                />
              </div>
            </div>
          </div>
        )}
      </DndSortableList>

      <VideoPreviewDialog
        video={openVideo}
        onClose={() => setOpenVideo(null)}
      />
    </>
  );
}
