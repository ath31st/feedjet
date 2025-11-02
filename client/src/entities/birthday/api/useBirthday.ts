import { queryClient, trpcWithProxy } from '@/shared/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUploadBirthdays = () => {
  return useMutation(
    trpcWithProxy.birthday.uploadFile.mutationOptions({
      onSuccess: (data, _, ctx) => {
        toast.success(
          `Файл успешно загружен, количество записей: ${data.birthdays.length}`,
          {
            id: ctx?.toastId,
          },
        );
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.birthday.birthdays.queryKey(),
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

export const useGetAllBirthdays = () => {
  return useQuery(trpcWithProxy.birthday.birthdays.queryOptions());
};

export const useCreateBirthday = () => {
  return useMutation(
    trpcWithProxy.birthday.create.mutationOptions({
      onSuccess() {
        toast.success('День рождения успешно добавлен');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.birthday.birthdays.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteBirthday = () => {
  return useMutation(
    trpcWithProxy.birthday.delete.mutationOptions({
      onSuccess() {
        toast.success('День рождения успешно удален');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.birthday.birthdays.queryKey(),
        });
      },
    }),
  );
};
