import { useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import type { MediaFile } from '@/entities/media-folder';
import { toast } from 'sonner';

interface UseMediaDeleteParams {
  folderId: number | null;
}

export function useMediaDelete({ folderId }: UseMediaDeleteParams) {
  const invalidateMedia = () => {
    queryClient.invalidateQueries({
      queryKey: trpcWithProxy.mediaFolder.listMedia.queryKey({
        folderId,
      }),
    });

    queryClient.invalidateQueries({
      queryKey: trpcWithProxy.mediaFolder.stats.queryKey(),
    });
  };

  const deleteImageMut = useMutation(
    trpcWithProxy.image.deleteFileGlobal.mutationOptions({
      onSuccess: () => {
        toast.success('Файл удалён');
        invalidateMedia();
      },
    }),
  );

  const deleteVideoMut = useMutation(
    trpcWithProxy.videoFile.deleteFileGlobal.mutationOptions({
      onSuccess: () => {
        toast.success('Файл удалён');
        invalidateMedia();
      },
    }),
  );

  const deleteFile = (file: MediaFile) => {
    if (file.kind === 'image') {
      deleteImageMut.mutate({
        filename: file.fileName,
      });

      return;
    }

    deleteVideoMut.mutate({
      filename: file.fileName,
    });
  };

  return {
    deleteFile,
  };
}
