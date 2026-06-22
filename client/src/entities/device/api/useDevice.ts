import { trpcWithProxy } from '@/shared/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useSendHeartbeat = () => {
  return useMutation(trpcWithProxy.device.registerDevice.mutationOptions());
};

export const useDeleteDevice = () => {
  return useMutation(trpcWithProxy.device.delete.mutationOptions());
};

export const useGetAllDevices = () => {
  return useQuery(trpcWithProxy.device.getAllDevices.queryOptions());
};
