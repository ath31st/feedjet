import { useQuery, useMutation } from '@tanstack/react-query';
import { trpc } from '../lib/trpc';

export const useMainConfig = () => {
  return useQuery(trpc.config.getMainConfig.queryOptions());
};

export const useAllowedThemes = () => {
  return useQuery(trpc.config.getAllowedThemes.queryOptions());
};

export const useUpdateKioskConfig = () => {
  return useMutation(trpc.config.update.mutationOptions());
};
