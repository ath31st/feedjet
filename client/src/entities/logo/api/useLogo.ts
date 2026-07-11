import { queryClient, trpcWithProxy } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUploadLogo = () => {
  return useMutation(
    trpcWithProxy.logo.uploadLogo.mutationOptions({
      onSuccess: (data, _, ctx) => {
        toast.success(`Логотип ${data.filename} успешно загружен`, {
          id: ctx?.toastId,
        });
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.logo.getLogo.queryKey(),
        });
      },
      onError: (err: unknown, _variables, ctx) => {
        if (ctx?.toastId)
          toast.error('Ошибка при загрузке логотипа', { id: ctx.toastId });
        else if (err instanceof Error)
          toast.error(err.message || 'Ошибка при загрузке логотипа');
      },
      onMutate: (data: FormData) => {
        return { toastId: toast.loading(`Загрузка ${data.get('filename')}…`) };
      },
    }),
  );
};

export const useDeleteLogo = () => {
  return useMutation(
    trpcWithProxy.logo.deleteLogo.mutationOptions({
      onSuccess: () => {
        toast.success('Логотип успешно удален');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.logo.getLogo.queryKey(),
        });
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при удалении логотипа');
          return;
        }
      },
    }),
  );
};
