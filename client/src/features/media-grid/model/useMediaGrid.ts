import { useDeleteImageGlobal } from '@/entities/image';
import {
  useDeleteMediaBatch,
  useMediaInFolder,
  type MediaFile,
} from '@/entities/media-folder';
import { useDeleteVideoGlobal } from '@/entities/video';
import { useState } from 'react';

interface Props {
  selectedFolderId: number | null;
  selectedFiles: Set<string>;
  setSelectedFiles: (set: Set<string>) => void;
}

export function useMediaGrid({
  selectedFolderId,
  selectedFiles,
  setSelectedFiles,
}: Props) {
  const { mutate: deleteImageMut } = useDeleteImageGlobal();
  const { mutate: deleteVideoMut } = useDeleteVideoGlobal();
  const { mutate: deleteMediaBatch } = useDeleteMediaBatch();
  const { data: media = [], isLoading } = useMediaInFolder(selectedFolderId);
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(
    () => new Set(),
  );

  const handleDeleteFile = (file: MediaFile) => {
    deleteFile(file);
    setSelectedFiles(new Set());
  };

  const handleBulkDelete = () => {
    const { imageIds, videoIds } = splitSelectionKeys(selectedFiles);
    if (imageIds.length === 0 && videoIds.length === 0) return;
    deleteMediaBatch(
      { imageIds, videoIds },
      {
        onSuccess: () => setSelectedFiles(new Set()),
      },
    );
  };

  const deleteFile = (file: MediaFile) => {
    if (file.kind === 'image') {
      deleteImageMut({ filename: file.fileName });
      return;
    }
    deleteVideoMut({ filename: file.fileName });
  };

  function splitSelectionKeys(keys: Set<string>): {
    imageIds: number[];
    videoIds: number[];
  } {
    const imageIds: number[] = [];
    const videoIds: number[] = [];
    for (const key of keys) {
      const [kind, idStr] = key.split('-');
      const id = Number(idStr);
      if (!Number.isFinite(id)) continue;
      if (kind === 'image') imageIds.push(id);
      else if (kind === 'video') videoIds.push(id);
    }
    return { imageIds, videoIds };
  }

  return {
    handleBulkDelete,
    handleDeleteFile,
    media,
    isLoading,
    failedThumbs,
    setFailedThumbs,
  };
}
