import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

export const useGetTickerConfig = (kioskId: number) => {
  return useQuery(
    trpcWithProxy.tickerConfig.getByKioskId.queryOptions({ kioskId }),
  );
};

export const useCreateTickerConfig = () => {
  return useMutation(
    trpcWithProxy.tickerConfig.create.mutationOptions({
      onSuccess() {
        toast.success('Настройки бегущей строки созданы');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.tickerConfig.getByKioskId.queryKey(),
        });
      },
    }),
  );
};

export const useUpdateTickerConfig = () => {
  return useMutation(
    trpcWithProxy.tickerConfig.update.mutationOptions({
      onSuccess() {
        toast.success('Настройки бегущей строки обновлены');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.tickerConfig.getByKioskId.queryKey(),
        });
      },
    }),
  );
};
