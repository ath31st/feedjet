import {
  useImageMetadataList,
  useRemoveImageFile,
  useUpdateImageDurations,
  useUpdateImageOrder,
  useUpdateKioskImage,
  type AdminImageInfo,
} from '@/entities/image';
import { useEffect, useState } from 'react';

export function useImageList(kioskId: number) {
  const { data: images = [], isLoading } = useImageMetadataList(kioskId);
  const { mutate: removeImage, isPending: isRemoving } = useRemoveImageFile();
  const { mutate: updateIsActive, isPending: isUpdatingActive } =
    useUpdateKioskImage();
  const { mutate: updateOrder } = useUpdateImageOrder();
  const { mutate: updateImageDurations } = useUpdateImageDurations();
  const [openImage, setOpenImage] = useState<AdminImageInfo | null>(null);

  const [ordered, setOrdered] = useState(images);

  useEffect(() => {
    setOrdered(images);
  }, [images]);

  const handleRemove = (fileName: string) => {
    removeImage({ filename: fileName, kioskId });
  };

  const handleUpdateDuration =
    (fileName: string) => (durationSeconds: number) => {
      updateImageDurations({
        kioskId,
        updates: [{ durationSeconds, fileName }],
      });
    };

  const handleUpdateIsActiveAndDuration = (
    fileName: string,
    isActive: boolean,
    durationSeconds: number,
  ) => {
    updateIsActive({ kioskId, fileName, isActive, durationSeconds });
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
    handleUpdateIsActiveAndDuration,
    handleUpdateDuration,
    handleReorder,
    openImage,
    setOpenImage,
  };
}
