import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

const invalidateScreenStates = () => {
  queryClient.invalidateQueries({
    queryKey: trpcWithProxy.control.getScreenStates.queryKey(),
  });
};

export const useGetScreenStates = (refetchInterval?: number) => {
  return useQuery(
    trpcWithProxy.control.getScreenStates.queryOptions(undefined, {
      refetchInterval,
    }),
  );
};

export const useDeviceScreenOff = () => {
  return useMutation(
    trpcWithProxy.control.screenOff.mutationOptions({
      onSuccess() {
        toast.success('Экран устройства выключен');
        invalidateScreenStates();
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при выключении экрана устройства');
          return;
        }
      },
    }),
  );
};

export const useDeviceScreenOn = () => {
  return useMutation(
    trpcWithProxy.control.screenOn.mutationOptions({
      onSuccess() {
        toast.success('Экран устройства включен');
        invalidateScreenStates();
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при включении экрана устройства');
          return;
        }
      },
    }),
  );
};
