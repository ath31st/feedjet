import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api';

export function useReloadDevicePageButton(ip: string) {
  const reload = useMutation(
    trpcWithProxy.control.reloadDevice.mutationOptions(),
  );

  const handleReload = () => {
    reload.mutate({ ip });
  };

  return {
    handleReload,
    isPending: reload.isPending,
    isSuccess: reload.isSuccess,
    isError: reload.isError,
  };
}
