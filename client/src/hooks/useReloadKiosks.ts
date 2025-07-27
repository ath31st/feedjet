import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy } from '../lib/trpc';

export function useReloadKiosks() {
  return useMutation(trpcWithProxy.control.reloadKiosks.mutationOptions());
}
