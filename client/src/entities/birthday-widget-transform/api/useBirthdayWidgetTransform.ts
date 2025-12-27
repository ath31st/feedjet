import { queryClient, trpcWithProxy } from '@/shared/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpsertBirthdayWidgetTransform = () => {
  return useMutation(
    trpcWithProxy.birthdayWidgetTransform.upsert.mutationOptions({
      onSuccess() {
        toast.success('Настройка сохранена');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.birthdayWidgetTransform.getByMonth.queryKey(),
        });
      },
    }),
  );
};

export const useGetBirthdayWidgetTransformByMonth = (month: number) => {
  return useQuery(
    trpcWithProxy.birthdayWidgetTransform.getByMonth.queryOptions({ month }),
  );
};

export const useGetDefaultBirthdayWidgetTransform = () => {
  return useQuery(
    trpcWithProxy.birthdayWidgetTransform.getDefault.queryOptions(),
  );
};
