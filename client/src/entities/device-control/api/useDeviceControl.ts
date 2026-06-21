import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

export const useDeviceScreenOff = () => {
  return useMutation(
    trpcWithProxy.control.screenOff.mutationOptions({
      onSuccess() {
        toast.success('Экран устройства выключен');
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

export const useDeviceScreenOn = () => {
  return useMutation(
    trpcWithProxy.control.screenOn.mutationOptions({
      onSuccess() {
        toast.success('Экран устройства включен');
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
