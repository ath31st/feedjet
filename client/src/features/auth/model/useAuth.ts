import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { queryClient, trpcWithProxy } from '@/shared/api';

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
        toast.success('Вход выполнен');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.auth.me.queryKey(),
        });
      },
      onError(err: unknown) {
        if (err instanceof Error) {
          console.log(err);
          toast.error(`Ошибка при входе: ${err.message}`);
          return;
        }
      },
    }),
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  return () => {
    localStorage.removeItem('token');
    queryClient.clear();
    toast.success('Выход выполнен');
    navigate('/login', { replace: true });
  };
};
