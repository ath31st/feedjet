import type { AdminImageInfo } from '@/entities/image';
import { DndSortableList } from '@/shared/ui';
import { useImageList } from '../model/useImageList';
import { ImagePreviewDialog } from './ImagePreviewDialog';
import { ImageItem } from './ImageItem';

interface ImageListProps {
  kioskId: number;
  globalDuration: number;
}

export function ImageList({ kioskId, globalDuration }: ImageListProps) {
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
          <ImageItem
            key={i.fileName}
            item={i}
            drag={drag}
            globalDuration={globalDuration}
            onRemove={handleRemove}
            onUpdateDuration={handleUpdateDuration}
            onUpdateActive={handleUpdateIsActiveAndDuration}
            onPreview={setOpenImage}
            isRemoving={isRemoving}
            isUpdatingActive={isUpdatingActive}
          />
        )}
      </DndSortableList>

      <ImagePreviewDialog
        image={openImage}
        onClose={() => setOpenImage(null)}
      />
    </>
  );
}
