import { formatBytes } from '@/shared/lib';
import { Cross1Icon, EyeOpenIcon } from '@radix-ui/react-icons';
import { IconButton } from '@/shared/ui/common';
import * as Switch from '@radix-ui/react-switch';
import { buildImageUrl, type AdminImageInfo } from '@/entities/image';
import { DndSortableList, RotationInterval } from '@/shared/ui';
import { useImageList } from '../model/useImageList';
import { ImagePreviewDialog } from './ImagePreviewDialog';

interface ImageListProps {
  kioskId: number;
}

export function ImageList({ kioskId }: ImageListProps) {
  const {
    ordered,
    isLoading,
    isRemoving,
    isUpdatingActive,
    handleRemove,
    handleUpdateIsActiveAndDuration,
    handleUpdateDuration,
    handleReorder,
    setOpenImage,
    openImage,
  } = useImageList(kioskId);

  if (isLoading) {
    return <div className="w-full text-(--meta-text) text-sm">Загрузка...</div>;
  }

  if (!ordered.length) {
    return (
      <div className="w-full text-(--meta-text) text-sm">
        Нет загруженных изображений
      </div>
    );
  }

  return (
    <>
      <DndSortableList<AdminImageInfo>
        items={ordered}
        getId={(i) => i.fileName}
        onReorder={handleReorder}
        className="flex flex-col gap-2"
      >
        {(i, _, drag) => (
          <div
            ref={drag.ref}
            {...drag.draggableProps}
            {...drag.dragHandleProps}
            className={`flex cursor-grab items-center gap-2 rounded-lg border ${i.isActive ? 'border-(--border)' : 'border-(--border-disabled)'} p-1 ${
              drag.isDragging ? 'opacity-70 shadow-lg' : ''
            }`}
          >
            <img
              src={`${buildImageUrl(i.thumbnail)}?v=${i.mtime}`}
              alt=""
              className="w-30 rounded-lg object-contain"
            />

            <div className="flex w-full items-center justify-between p-1">
              <div className="flex w-full flex-col overflow-hidden text-(--meta-text) text-xs">
                <span className="truncate text-(--text) text-sm">{i.name}</span>

                <div className="flex w-[80%] flex-row items-center">
                  <div className="flex flex-1 flex-col">
                    <span>
                      Разрешение: {i.width}x{i.height}px
                    </span>
                    <span>Формат: {i.format}</span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span>Размер: {formatBytes(i.size)}</span>
                    <span>
                      Дата загрузки:{' '}
                      {new Date(i.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span>Длительность показа изображения:</span>

                    <RotationInterval
                      inputId={'image-rotation-interval'}
                      value={i.durationSeconds ?? 0}
                      update={handleUpdateDuration(i.fileName)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Switch.Root
                  checked={i.isActive ?? false}
                  disabled={isUpdatingActive}
                  onCheckedChange={(checked) =>
                    handleUpdateIsActiveAndDuration(i.fileName, checked, 0)
                  }
                  className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-(--border) transition-colors data-[state=checked]:bg-(--button-bg)"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-px rounded-full bg-(--text) transition-transform data-[state=checked]:translate-x-5.25" />
                </Switch.Root>

                <IconButton
                  disabled={isLoading}
                  onClick={() => setOpenImage(i)}
                  tooltip="Открыть изображение"
                  icon={<EyeOpenIcon className="h-4 w-4 cursor-pointer" />}
                />

                <IconButton
                  disabled={isRemoving}
                  onClick={() => handleRemove(i.fileName)}
                  tooltip="Удалить изображение"
                  icon={<Cross1Icon className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        )}
      </DndSortableList>

      <ImagePreviewDialog
        image={openImage}
        onClose={() => setOpenImage(null)}
      />
    </>
  );
}
