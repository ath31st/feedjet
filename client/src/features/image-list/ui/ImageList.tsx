import { formatBytes } from '@/shared/lib';
import { Cross1Icon } from '@radix-ui/react-icons';
import { IconButton } from '@/shared/ui/common';
import * as Switch from '@radix-ui/react-switch';
import {
  buildImageUrl,
  useImageMetadataList,
  useRemoveImageFile,
  useUpdateImageOrder,
  useUpdateIsActiveImage,
} from '@/entities/image';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';

interface ImageListProps {
  kioskId: number;
}

export function ImageList({ kioskId }: ImageListProps) {
  const { data: images = [], isLoading } = useImageMetadataList(kioskId);
  const { mutate: removeImage, isPending } = useRemoveImageFile();
  const { mutate: updateIsActive, isPending: isActivePending } =
    useUpdateIsActiveImage();
  const { mutate: updateOrder } = useUpdateImageOrder();

  const [ordered, setOrdered] = useState(images);

  useEffect(() => {
    setOrdered(images);
  }, [images]);

  const handleRemoveImage = (fileName: string) => {
    removeImage({ filename: fileName, kioskId });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(ordered);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);

    const updates = newItems.map((item, idx) => ({
      fileName: item.fileName,
      order: idx,
    }));

    setOrdered(
      newItems.map((i, idx) => ({
        ...i,
        order: idx,
      })),
    );

    updateOrder({ kioskId, updates });
  };

  if (isLoading) {
    return (
      <div className="w-full text-[var(--meta-text)] text-sm">Загрузка...</div>
    );
  }

  if (!images.length) {
    return (
      <div className="w-full text-[var(--meta-text)] text-sm">
        Нет загруженных изображений
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="image-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-2"
          >
            {ordered.map((i, index) => (
              <Draggable
                key={i.fileName}
                draggableId={i.fileName}
                index={index}
              >
                {(p, snap) => (
                  <div
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    className={`flex cursor-grab items-center gap-2 rounded-lg border border-(--border) p-1 ${
                      snap.isDragging ? 'opacity-70 shadow-lg' : ''
                    }`}
                  >
                    <img
                      src={`${buildImageUrl(i.thumbnail)}?v=${i.mtime}`}
                      alt=""
                      className="w-30 rounded-lg object-contain"
                    />

                    <div className="flex w-[calc(100%-180px)] justify-between">
                      <div className="flex flex-col overflow-hidden text-(--meta-text) text-xs">
                        <span className="truncate text-(--text) text-sm">
                          {i.name}
                        </span>
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
                              Дата загрузки:{' '}
                              {new Date(i.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-2">
                        <Switch.Root
                          checked={i.isActive ?? false}
                          disabled={isActivePending}
                          onCheckedChange={(checked) =>
                            updateIsActive({
                              kioskId,
                              fileName: i.fileName,
                              isActive: checked,
                            })
                          }
                          className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-[var(--border)] transition-colors data-[state=checked]:bg-[var(--button-bg)]"
                        >
                          <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-[var(--text)] transition-transform data-[state=checked]:translate-x-[21px]" />
                        </Switch.Root>

                        <IconButton
                          disabled={isPending}
                          onClick={() => handleRemoveImage(i.fileName)}
                          tooltip="Удалить"
                          icon={<Cross1Icon className="h-4 w-4" />}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
