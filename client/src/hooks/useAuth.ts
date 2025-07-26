import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '../lib/trpc';
import { useNavigate } from 'react-router-dom';

export const useMe = () => {
  return useQuery({
    ...trpcWithProxy.auth.me.queryOptions(),
    retry: false,
  });
};

export const useLogin = () => {
  return useMutation({
    ...trpcWithProxy.auth.login.mutationOptions({
      onSuccess(data) {
        localStorage.setItem('token', data.token);
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.auth.me.queryKey(),
        });
      },
    }),
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  return () => {
    localStorage.removeItem('token');
    queryClient.clear();
    navigate('/login', { replace: true });
  };
};
