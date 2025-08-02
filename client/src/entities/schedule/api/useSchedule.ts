import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api/trpc/trpc';
import { toast } from 'sonner';

export const useFindScheduleEventById = (id: string | number) => {
  return useQuery(trpcWithProxy.scheduleEvent.findById.queryOptions({ id }));
};

export const useFindScheduleEventByDate = (date: string) => {
  return useQuery(
    trpcWithProxy.scheduleEvent.findByDate.queryOptions({ date }),
  );
};

export const useCreateScheduleEvent = () => {
  return useMutation(
    trpcWithProxy.scheduleEvent.create.mutationOptions({
      onSuccess() {
        toast.success('Событие успешно добавлено');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.scheduleEvent.findByDateRange.queryKey(),
        });
      },
    }),
  );
};

export const useUpdateScheduleEvent = () => {
  return useMutation(
    trpcWithProxy.scheduleEvent.update.mutationOptions({
      onSuccess() {
        toast.success('Событие успешно обновлено');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.scheduleEvent.findByDateRange.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteScheduleEvent = () => {
  return useMutation(
    trpcWithProxy.scheduleEvent.delete.mutationOptions({
      onSuccess() {
        toast.success('RSS успешно удален');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.scheduleEvent.findByDateRange.queryKey(),
        });
      },
    }),
  );
};
