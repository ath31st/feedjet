import { queryClient, trpcWithProxy } from '@/shared/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUploadBackground = () => {
  return useMutation(
    trpcWithProxy.birthdayBackground.uploadBackground.mutationOptions({
      onSuccess: (_data, _, ctx) => {
        toast.success('Фон успешно загружен', {
          id: ctx?.toastId,
        });
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.birthdayBackground.backgrounds.queryKey(),
        });
      },
      onError: (err: unknown, _variables, ctx) => {
        if (ctx?.toastId)
          toast.error('Ошибка при загрузке фона', { id: ctx.toastId });
        else if (err instanceof Error)
          toast.error(err.message || 'Ошибка при загрузке фона');
      },
      onMutate: (data: FormData) => {
        const file = data.get('file') as File | null;
        const toastId = toast.loading(`Загрузка ${file?.name ?? 'файла'}…`);
        return { toastId };
      },
    }),
  );
};

export const useGetBackgrounds = () => {
  return useQuery(trpcWithProxy.birthdayBackground.backgrounds.queryOptions());
};

export const useDeleteBackground = () => {
  return useMutation(
    trpcWithProxy.birthdayBackground.delete.mutationOptions({
      onSuccess() {
        toast.success('Фон успешно удален');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.birthdayBackground.backgrounds.queryKey(),
        });
      },
    }),
  );
};

export const useGetBackgroundByMonth = (month: number) => {
  return useQuery(
    trpcWithProxy.birthdayBackground.getByMonth.queryOptions({ month }),
  );
};
