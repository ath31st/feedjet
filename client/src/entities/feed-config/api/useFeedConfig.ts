import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

export const useFeedConfig = (kioskId: number) => {
  return useQuery(trpcWithProxy.feedConfig.getConfig.queryOptions({ kioskId }));
};

export const useUpdateFeedConfig = () => {
  return useMutation(
    trpcWithProxy.feedConfig.update.mutationOptions({
      onSuccess() {
        toast.success('Настройки ленты RSS обновлены');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.feedConfig.getConfig.queryKey(),
        });
      },
    }),
  );
};
