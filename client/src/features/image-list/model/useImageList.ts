import {
  useImageMetadataList,
  useRemoveImageFile,
  useUpdateImageOrder,
  useUpdateIsActiveImage,
} from '@/entities/image';
import { useEffect, useState } from 'react';
import type { DropResult } from '@hello-pangea/dnd';

export function useImageList(kioskId: number) {
  const { data: images = [], isLoading } = useImageMetadataList(kioskId);
  const { mutate: removeImage, isPending: isRemoving } = useRemoveImageFile();
  const { mutate: updateIsActive, isPending: isUpdatingActive } =
    useUpdateIsActiveImage();
  const { mutate: updateOrder } = useUpdateImageOrder();

  const [ordered, setOrdered] = useState(images);

  useEffect(() => {
    setOrdered(images);
  }, [images]);

  const handleRemove = (fileName: string) => {
    removeImage({ filename: fileName, kioskId });
  };

  const handleToggleActive = (fileName: string, isActive: boolean) => {
    updateIsActive({ kioskId, fileName, isActive });
  };

  const handleDragEnd = (result: DropResult) => {
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

  return {
    ordered,
    isLoading,
    isRemoving,
    isUpdatingActive,
    handleRemove,
    handleToggleActive,
    handleDragEnd,
  };
}
