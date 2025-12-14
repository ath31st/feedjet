import {
  useRemoveVideoFile,
  useUpdateIsActive,
  useUpdateVideoOrder,
  useVideoMetadataList,
  type AdminVideoInfo,
  type VideoMetadata,
} from '@/entities/video';
import { useEffect, useState } from 'react';

export const useVideoList = (kioskId: number) => {
  const { data: videos = [], isLoading } = useVideoMetadataList(kioskId);
  const { mutate: removeVideo, isPending: isRemoving } = useRemoveVideoFile();
  const { mutate: updateIsActive, isPending: isUpdatingActive } =
    useUpdateIsActive();
  const [openVideo, setOpenVideo] = useState<VideoMetadata | null>(null);
  const { mutate: updateOrder } = useUpdateVideoOrder();

  const [ordered, setOrdered] = useState(videos);

  useEffect(() => {
    setOrdered(videos);
  }, [videos]);

  const handleRemoveVideo = (videoName: string) => {
    removeVideo({
      filename: videoName,
      kioskId,
    });
  };

  const handleToggleActive = (fileName: string, isActive: boolean) => {
    updateIsActive({ kioskId, filename: fileName, isActive });
  };

  const handleReorder = (newItems: AdminVideoInfo[]) => {
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
    handleRemoveVideo,
    openVideo,
    setOpenVideo,
    handleToggleActive,
    handleReorder,
  };
};
