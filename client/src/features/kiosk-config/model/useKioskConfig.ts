import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '../../../shared/api/trpc/trpc';
import { toast } from 'sonner';

export const useMainConfig = () => {
  return useQuery(trpcWithProxy.config.getMainConfig.queryOptions());
};

export const useAllowedThemes = () => {
  return useQuery(trpcWithProxy.config.getAllowedThemes.queryOptions());
};

export const useUpdateKioskConfig = () => {
  return useMutation(
    trpcWithProxy.config.update.mutationOptions({
      onSuccess() {
        toast.success('Настройки киоска обновлены');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.config.getMainConfig.queryKey(),
        });
      },
    }),
  );
};
