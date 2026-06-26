import { useQuery, useMutation } from '@tanstack/react-query';
import { trpcWithProxy, queryClient } from '@/shared/api';
import { toast } from 'sonner';

export const useDiskUsage = () => {
  return useQuery(trpcWithProxy.videoFile.getDiskUsage.queryOptions());
};

const invalidateMedia = () => {
  queryClient.invalidateQueries({
    queryKey: trpcWithProxy.mediaFolder.listMedia.queryKey(),
  });

  queryClient.invalidateQueries({
    queryKey: trpcWithProxy.mediaFolder.stats.queryKey(),
  });

  queryClient.invalidateQueries({
    queryKey: trpcWithProxy.videoFile.getDiskUsage.queryKey(),
  });
};

export const useDeleteVideoGlobal = () => {
  return useMutation(
    trpcWithProxy.videoFile.deleteFileGlobal.mutationOptions({
      onSuccess: () => {
        toast.success('Файл успешно удален');
        invalidateMedia();
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при удалении файла');
          return;
        }
      },
    }),
  );
};

export const useUploadVideo = () => {
  return useMutation(
    trpcWithProxy.videoFile.uploadFile.mutationOptions({
      onSuccess: (data, _, ctx) => {
        toast.success(`Файл ${data.filename} успешно загружен`, {
          id: ctx?.toastId,
        });
        invalidateMedia();
      },
      onError: (err: unknown, _variables, ctx) => {
        if (ctx?.toastId)
          toast.error('Ошибка при загрузке файла', { id: ctx.toastId });
        else if (err instanceof Error)
          toast.error(err.message || 'Ошибка при загрузке файла');
      },
      onMutate: (data: FormData) => {
        return { toastId: toast.loading(`Загрузка ${data.get('filename')}…`) };
      },
    }),
  );
};
