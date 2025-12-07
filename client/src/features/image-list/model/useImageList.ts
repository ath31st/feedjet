import {
  useImageMetadataList,
  useRemoveImageFile,
  useUpdateImageOrder,
  useUpdateIsActiveImage,
  type AdminImageInfo,
} from '@/entities/image';
import { useEffect, useState } from 'react';

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

  const handleReorder = (newItems: AdminImageInfo[]) => {
    const normalized = newItems.map((item, idx) => ({ ...item, order: idx }));
    setOrdered(normalized);

    const updates = normalized.map((item) => ({
      fileName: item.fileName,
      order: item.order,
    }));

    updateOrder({ kioskId, updates });
  };

  return {
    ordered,
    isLoading,
    isRemoving,
    isUpdatingActive,
    handleRemove,
    handleToggleActive,
    handleReorder,
  };
}
