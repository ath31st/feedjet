import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy } from '../../../shared/api/trpc/trpc';

export function useReloadKiosks() {
  return useMutation(trpcWithProxy.control.reloadKiosks.mutationOptions());
}
