import { useQuery, useMutation } from '@tanstack/react-query';
import { trpcWithProxy, queryClient } from '@/shared/api/trpc';
import { toast } from 'sonner';

export const useVideoWithMetadataList = () => {
  return useQuery(trpcWithProxy.videoFile.listFiles.queryOptions());
};

export const useDiskUsage = () => {
  return useQuery(trpcWithProxy.videoFile.getDiskUsage.queryOptions());
};

export const useVideoFile = () => {
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
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при загрузке файла');
          return;
        }
      },
      onMutate: (data: FormData) => {
        return { toastId: toast.loading(`Загрузка ${data.get('filename')}…`) };
      },
    }),
  );
};
