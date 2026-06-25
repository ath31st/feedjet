import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

export const useDeleteIntegration = () => {
  return useMutation(
    trpcWithProxy.integration.delete.mutationOptions({
      onSuccess() {
        toast.success('Интеграция успешно удалена');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.integration.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useCreateIntegration = () => {
  return useMutation(
    trpcWithProxy.integration.create.mutationOptions({
      onSuccess() {
        toast.success('Интеграция успешно добавлена');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.integration.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useUpdateIntegration = () => {
  return useMutation(
    trpcWithProxy.integration.update.mutationOptions({
      onSuccess() {
        toast.success('Интеграция успешно обновлена');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.integration.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useGetIntegrationById = (integrationId: number) => {
  return useQuery(
    trpcWithProxy.integration.getById.queryOptions({ integrationId }),
  );
};

export const useGetIntegrationByIp = (ip: string) => {
  return useQuery(trpcWithProxy.integration.getByIp.queryOptions({ ip }));
};

export const useGetAllIntegrations = () => {
  return useQuery(trpcWithProxy.integration.getAll.queryOptions());
};

export const useExistsByKioksId = (kioskId: number) => {
  return useQuery(
    trpcWithProxy.integration.existsByKioskId.queryOptions({ kioskId }),
  );
};

export const useExistsByIpIntegration = (ip: string) => {
  return useQuery(trpcWithProxy.integration.existsByIp.queryOptions({ ip }));
};

export const usePairPhilipsStart = () => {
  return useMutation(
    trpcWithProxy.integration.pairPhilipsStart.mutationOptions({
      onError(error) {
        toast.error(error.message || 'Не удалось запустить сопряжение');
      },
    }),
  );
};

export const usePairPhilipsComplete = () => {
  return useMutation(
    trpcWithProxy.integration.pairPhilipsComplete.mutationOptions({
      onSuccess() {
        toast.success('Сопряжение с Philips TV завершён');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.integration.getAll.queryKey(),
        });
      },
      onError(error) {
        toast.error(error.message || 'Не удалось завершить сопряжение');
      },
    }),
  );
};
