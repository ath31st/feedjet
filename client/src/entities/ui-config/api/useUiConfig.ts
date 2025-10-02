import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api/trpc';
import { toast } from 'sonner';

export const useGetUiConfig = (kioskId: number) => {
  return useQuery(trpcWithProxy.uiConfig.getUiConfig.queryOptions({ kioskId }));
};

export const useUpdateUiConfig = () => {
  return useMutation(
    trpcWithProxy.uiConfig.update.mutationOptions({
      onSuccess() {
        toast.success('Настройки UI обновлены');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.uiConfig.getUiConfig.queryKey(),
        });
      },
    }),
  );
};
