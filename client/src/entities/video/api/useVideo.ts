import { useQuery, useMutation } from '@tanstack/react-query';
import { trpcWithProxy, queryClient } from '@/shared/api';
import { toast } from 'sonner';

export const useVideoWithMetadataList = () => {
  return useQuery(trpcWithProxy.videoFile.listFiles.queryOptions());
};

export const useActiveVideoList = () => {
  return useQuery(trpcWithProxy.videoFile.listActiveVideos.queryOptions());
};

export const useDiskUsage = () => {
  return useQuery(trpcWithProxy.videoFile.getDiskUsage.queryOptions());
};

export const useRemoveVideoFile = () => {
  return useMutation(
    trpcWithProxy.videoFile.deleteFile.mutationOptions({
      onSuccess: () => {
        toast.success('Файл успешно удален');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.videoFile.listFiles.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.videoFile.getDiskUsage.queryKey(),
        });
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
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.videoFile.listFiles.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.videoFile.getDiskUsage.queryKey(),
        });
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

export const useUpdateIsActiveVideoWithMetadata = () => {
  return useMutation(
    trpcWithProxy.videoFile.updateIsActive.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          `Файл ${data ? 'добавлен в список проигрывания' : 'удален из списка проигрывания'}`,
        );
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.videoFile.listFiles.queryKey(),
        });
      },
      onError: (err: unknown) => {
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.videoFile.listFiles.queryKey(),
        });
        if (err instanceof Error) {
          toast.error(
            err.message || 'Ошибка при обновлении списка проигрывания',
          );
          return;
        }
      },
    }),
  );
};
