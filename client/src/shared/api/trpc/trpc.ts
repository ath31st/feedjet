import { QueryClient } from '@tanstack/react-query';
import {
  splitLink,
  httpLink,
  httpBatchLink,
  isNonJsonSerializable,
  createTRPCClient,
} from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@shared/trpc/router';
import { toast } from 'sonner';
import { SERVER_URL } from '@/shared/config';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: ({ message }) => {
        console.error(message);
        toast.error('Ошибка при изменении, подробности в консоли (F12)');
      },
    },
  },
});

const trpcUrl = `${SERVER_URL}/trpc`;

function handleUnauthorized(): void {
  localStorage.removeItem('token');
  queryClient.clear();
  window.location.href = '/login';
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => isNonJsonSerializable(op.input),

      true: httpLink({
        url: trpcUrl,
        fetch: async (url, options) => {
          const token = localStorage.getItem('token');
          const headers = new Headers(options?.headers);
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          const response = await fetch(url, {
            ...(options as RequestInit),
            headers,
          });
          
          if (response.status === 401) {
            handleUnauthorized();
          }
          
          return response;
        },
      }),

      false: httpBatchLink({
        url: trpcUrl,
        fetch: async (url, options) => {
          const token = localStorage.getItem('token');
          const headers = new Headers(options?.headers);
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          const response = await fetch(url, {
            ...(options as RequestInit),
            headers,
          });
          
          if (response.status === 401) {
            handleUnauthorized();
          }
          
          return response;
        },
      }),
    }),
  ],
});

export const trpcWithProxy = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
