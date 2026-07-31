import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy, queryClient } from '@/shared/api';
import { toast } from 'sonner';

const invalidateMedia = () => {
  queryClient.invalidateQueries({
    queryKey: trpcWithProxy.mediaFolder.listMedia.queryKey(),
  });

  queryClient.invalidateQueries({
    queryKey: trpcWithProxy.mediaFolder.stats.queryKey(),
  });
};

export const useDeletePdfGlobal = () => {
  return useMutation(
    trpcWithProxy.pdfFile.deleteFileGlobal.mutationOptions({
      onSuccess: () => {
        toast.success('Файл успешно удален');
        invalidateMedia();
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при удалении файла');
        }
      },
    }),
  );
};

export const useUploadPdf = () => {
  return useMutation(
    trpcWithProxy.pdfFile.uploadFile.mutationOptions({
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
