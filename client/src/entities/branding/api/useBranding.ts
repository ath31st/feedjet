import { queryClient, trpcWithProxy } from '@/shared/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetCurrentConfig = () => {
  return useQuery(trpcWithProxy.brandingConfig.getCurrentConfig.queryOptions());
};

export const useGetConfigById = (brandingConfigId: number) => {
  return useQuery(
    trpcWithProxy.brandingConfig.getConfig.queryOptions({
      brandingConfigId,
    }),
  );
};

export const useUpdateConfig = () => {
  return useMutation(
    trpcWithProxy.brandingConfig.update.mutationOptions({
      onSuccess() {
        toast.success('Настройки брендинга сохранены');

        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.brandingConfig.getCurrentConfig.queryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.brandingConfig.getConfig.queryKey(),
        });
      },
    }),
  );
};
