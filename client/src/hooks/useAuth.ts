import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, trpc } from '../lib/trpc';
import { useNavigate } from 'react-router-dom';

export const useMe = () => {
  return useQuery({
    ...trpc.auth.me.queryOptions(),
    retry: false,
  });
};

export const useLogin = () => {
  return useMutation({
    ...trpc.auth.login.mutationOptions({
      onSuccess(data) {
        localStorage.setItem('token', data.token);
        queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
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
