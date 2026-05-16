import type { MediaFile } from '@/entities/media-folder';
import { useDeleteImageGlobal } from '@/entities/image';
import { useDeleteVideoGlobal } from '@/entities/video';

export function useMediaDelete() {
  const { mutate: deleteImageMut } = useDeleteImageGlobal();
  const { mutate: deleteVideoMut } = useDeleteVideoGlobal();

  const deleteFile = (file: MediaFile) => {
    if (file.kind === 'image') {
      deleteImageMut({ filename: file.fileName });
      return;
    }
    deleteVideoMut({ filename: file.fileName });
  };

  return { deleteFile };
}
