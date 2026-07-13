import { queryClient, trpcWithProxy } from '@/shared/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSendHeartbeat = () => {
  return useMutation(trpcWithProxy.device.registerDevice.mutationOptions());
};

export const useDeleteDevice = () => {
  return useMutation(
    trpcWithProxy.device.delete.mutationOptions({
      onSuccess() {
        toast.success('Устройство успешно удалено');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.device.getAllDevices.queryKey(),
        });
      },
    }),
  );
};

export const useGetAllDevices = (refetchInterval?: number) => {
  return useQuery(
    trpcWithProxy.device.getAllDevices.queryOptions(undefined, {
      refetchInterval,
    }),
  );
};
