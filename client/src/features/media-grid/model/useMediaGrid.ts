import { useDeleteImageGlobal } from '@/entities/image';
import { useMediaInFolder, type MediaFile } from '@/entities/media-folder';
import { useDeleteVideoGlobal } from '@/entities/video';
import { useState } from 'react';

interface Props {
  selectedFolderId: number | null;
}

export function useMediaGrid({ selectedFolderId }: Props) {
  const { mutate: deleteImageMut } = useDeleteImageGlobal();
  const { mutate: deleteVideoMut } = useDeleteVideoGlobal();
  const { data: media = [], isLoading } = useMediaInFolder(selectedFolderId);
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(
    () => new Set(),
  );

  const handleDeleteFile = (file: MediaFile) => {
    deleteFile(file);
  };

  const deleteFile = (file: MediaFile) => {
    if (file.kind === 'image') {
      deleteImageMut({ filename: file.fileName });
      return;
    }
    deleteVideoMut({ filename: file.fileName });
  };

  return {
    handleDeleteFile,
    media,
    isLoading,
    failedThumbs,
    setFailedThumbs,
  };
}
