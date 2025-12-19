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

export const useGetIntegrationByKiosk = (kioskId: number) => {
  return useQuery(
    trpcWithProxy.integration.getByKioskId.queryOptions({ kioskId }),
  );
};

export const useGetAllIntegrations = () => {
  return useQuery(trpcWithProxy.integration.getAll.queryOptions());
};
