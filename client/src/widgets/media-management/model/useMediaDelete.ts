import type { MediaFile } from '@/entities/media-folder';
import { useDeleteImageGlobal } from '@/entities/image';
import { useDeleteVideoGlobal } from '@/entities/video';

interface UseMediaDeleteParams {
  folderId: number | null;
}

export function useMediaDelete({ folderId }: UseMediaDeleteParams) {
  const { mutate: deleteImageMut } = useDeleteImageGlobal(folderId);
  const { mutate: deleteVideoMut } = useDeleteVideoGlobal(folderId);

  const deleteFile = (file: MediaFile) => {
    if (file.kind === 'image') {
      deleteImageMut({ filename: file.fileName });
      return;
    }
    deleteVideoMut({ filename: file.fileName });
  };

  return { deleteFile };
}
