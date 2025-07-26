import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@shared/trpc/router';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: ({ message }) => {
        console.error(message);
        toast.error('Ошибка при изменении, подробности в консоли (F12)');
      },
      onSuccess: () => {
        toast.success('Данные обновлены');
      },
    },
  },
});

const trpcUrl = `${import.meta.env.VITE_API_URL}/trpc`;

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: trpcUrl,
      fetch: async (url, options) => {
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          window.location.replace('/login');
        }
        return response;
      },
    }),
  ],
});

export const trpcWithProxy = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
