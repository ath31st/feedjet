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

export const useUpdateBirthday = () => {
  return useMutation(
    trpcWithProxy.birthday.update.mutationOptions({
      onSuccess() {
        toast.success('День рождения успешно обновлен');
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

export const useGetBirthdaysByMonth = (month: number) => {
  return useQuery(
    trpcWithProxy.birthday.birthdaysByMonth.queryOptions({ month }),
  );
};

export const useGetBirthdaysByDayMonthRange = (start: Date, end: Date) => {
  return useQuery(
    trpcWithProxy.birthday.birthdaysDayMonthRange.queryOptions({
      startDate: start,
      endDate: end,
    }),
  );
};
