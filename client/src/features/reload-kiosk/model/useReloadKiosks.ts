import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api/trpc/trpc';

export function useReloadKioskPageButton() {
  const reload = useMutation(
    trpcWithProxy.control.reloadKiosks.mutationOptions(),
  );

  const handleReload = () => {
    reload.mutate();
  };

  return {
    handleReload,
    isPending: reload.isPending,
    isSuccess: reload.isSuccess,
    isError: reload.isError,
  };
}
