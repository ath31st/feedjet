import { trpcWithProxy } from '@/shared/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useSendHeartbeat = () => {
  return useMutation(trpcWithProxy.kioskHeartbeat.heartbeat.mutationOptions());
};

export const useGetActiveHeartbeats = (timeoutMs: number) => {
  return useQuery(
    trpcWithProxy.kioskHeartbeat.getActiveHeartbeats.queryOptions({
      timeoutMs,
    }),
  );
};
