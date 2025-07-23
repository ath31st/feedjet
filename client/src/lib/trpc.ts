import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@shared/trpc/router';

export const queryClient = new QueryClient();

const trpcUrl = `${import.meta.env.VITE_API_URL}/trpc`;

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: trpcUrl,
      fetch: async (url, options) => {
        const response = await fetch(url, {
          ...options,
          credentials: 'include',
        });
        if (response.status === 401) {
          window.location.replace('/login');
        }
        return response;
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
