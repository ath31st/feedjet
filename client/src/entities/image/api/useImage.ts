import { useQuery, useMutation } from '@tanstack/react-query';
import { trpcWithProxy, queryClient } from '@/shared/api';
import { toast } from 'sonner';

export const useImageMetadataList = (kioskId: number) => {
  return useQuery(trpcWithProxy.image.listFiles.queryOptions({ kioskId }));
};

export const useActiveImageList = (kioskId: number) => {
  return useQuery(
    trpcWithProxy.image.listActiveImages.queryOptions({ kioskId }),
  );
};

export const useDiskUsage = () => {
  return useQuery(trpcWithProxy.image.getDiskUsage.queryOptions());
};

export const useRemoveImageFile = () => {
  return useMutation(
    trpcWithProxy.image.deleteFile.mutationOptions({
      onSuccess: () => {
        toast.success('Файл успешно удален');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.image.listFiles.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.image.getDiskUsage.queryKey(),
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

export const useUploadImage = () => {
  return useMutation(
    trpcWithProxy.image.uploadFile.mutationOptions({
      onSuccess: (data, _, ctx) => {
        toast.success(`Файл ${data.filename} успешно загружен`, {
          id: ctx?.toastId,
        });
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.image.listFiles.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.image.getDiskUsage.queryKey(),
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

export const useUpdateImageOrder = () => {
  return useMutation(
    trpcWithProxy.image.updateImageOrder.mutationOptions({
      onSuccess: () => {
        toast.success('Порядок успешно обновлен');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.image.listFiles.queryKey(),
        });
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при обновлении порядка');
          return;
        }
      },
    }),
  );
};

export const useUpdateIsActiveImage = () => {
  return useMutation(
    trpcWithProxy.image.updateIsActiveImage.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          `Файл ${data ? 'добавлен в список отображения' : 'удален из списка отображения'}`,
        );
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.image.listFiles.queryKey(),
        });
      },
      onError: (err: unknown) => {
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.image.listFiles.queryKey(),
        });
        if (err instanceof Error) {
          toast.error(
            err.message || 'Ошибка при обновлении списка отображения',
          );
          return;
        }
      },
    }),
  );
};
