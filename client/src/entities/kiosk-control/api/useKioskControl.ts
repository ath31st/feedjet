import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

export const useKioskScreenOff = () => {
  return useMutation(
    trpcWithProxy.control.screenOff.mutationOptions({
      onSuccess() {
        toast.success('Экран выключен');
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при включении экрана');
          return;
        }
      },
    }),
  );
};

export const useKioskScreenOn = () => {
  return useMutation(
    trpcWithProxy.control.screenOn.mutationOptions({
      onSuccess() {
        toast.success('Экран включен');
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при включении экрана');
          return;
        }
      },
    }),
  );
};
