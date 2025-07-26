import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '../lib/trpc';

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
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.config.getMainConfig.queryKey(),
        });
      },
    }),
  );
};
