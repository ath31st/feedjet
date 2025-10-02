import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api/trpc/trpc';

export function useReloadKioskPageButton(kioskId: number) {
  const reload = useMutation(
    trpcWithProxy.control.reloadKiosks.mutationOptions(),
  );

  const handleReload = () => {
    reload.mutate({ kioskId });
  };

  return {
    handleReload,
    isPending: reload.isPending,
    isSuccess: reload.isSuccess,
    isError: reload.isError,
  };
}
