import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api';

export function useReloadDevicePageButton(deviceId: string) {
  const reload = useMutation(
    trpcWithProxy.control.reloadDevice.mutationOptions(),
  );

  const handleReload = () => {
    reload.mutate({ deviceId });
  };

  return {
    handleReload,
    isPending: reload.isPending,
    isSuccess: reload.isSuccess,
    isError: reload.isError,
  };
}
