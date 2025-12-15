import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

export const useGetKioskWorkSchedules = (kioskId: number) => {
  return useQuery(
    trpcWithProxy.kioskWorkSchedule.getByKioskId.queryOptions({ kioskId }),
  );
};

export const useUpsertDayKioskWorkSchedule = () => {
  return useMutation(
    trpcWithProxy.kioskWorkSchedule.upsertDay.mutationOptions({
      onSuccess() {
        toast.success('Режим работы успешно обновлен');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.kioskWorkSchedule.getByKioskId.queryKey(),
        });
      },
    }),
  );
};
