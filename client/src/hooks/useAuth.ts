import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, trpc } from '../lib/trpc';

export const useMe = () => {
  return useQuery({
    ...trpc.auth.me.queryOptions(),
    retry: false,
  });
};

export const useLogin = () => {
  return useMutation({
    ...trpc.auth.login.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
    },
  });
};
