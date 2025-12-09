// features/manage-images/ui/ImageList.tsx
import { formatBytes } from '@/shared/lib';
import { Cross1Icon } from '@radix-ui/react-icons';
import { IconButton } from '@/shared/ui/common';
import * as Switch from '@radix-ui/react-switch';
import { buildImageUrl, type AdminImageInfo } from '@/entities/image';
import { DndSortableList } from '@/shared/ui';
import { useImageList } from '../model/useImageList';

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
    handleToggleActive,
    handleReorder,
  } = useImageList(kioskId);

  if (isLoading) {
    return (
      <div className="w-full text-[var(--meta-text)] text-sm">Загрузка...</div>
    );
  }

  if (!ordered.length) {
    return (
      <div className="w-full text-[var(--meta-text)] text-sm">
        Нет загруженных изображений
      </div>
    );
  }

  return (
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

          <div className="flex w-[calc(100%-180px)] justify-between">
            <div className="flex flex-col overflow-hidden text-(--meta-text) text-xs">
              <span className="truncate text-(--text) text-sm">{i.name}</span>

              <div className="flex flex-row gap-10">
                <div className="flex flex-col">
                  <span>
                    Разрешение: {i.width}x{i.height}px
                  </span>
                  <span>Формат: {i.format}</span>
                </div>
                <div className="flex flex-col">
                  <span>Размер: {formatBytes(i.size)}</span>
                  <span>
                    Дата загрузки: {new Date(i.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <Switch.Root
                checked={i.isActive ?? false}
                disabled={isUpdatingActive}
                onCheckedChange={(checked) =>
                  handleToggleActive(i.fileName, checked)
                }
                className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-[var(--border)] transition-colors data-[state=checked]:bg-[var(--button-bg)]"
              >
                <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-[var(--text)] transition-transform data-[state=checked]:translate-x-[21px]" />
              </Switch.Root>

              <IconButton
                disabled={isRemoving}
                onClick={() => handleRemove(i.fileName)}
                tooltip="Удалить"
                icon={<Cross1Icon className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      )}
    </DndSortableList>
  );
}
