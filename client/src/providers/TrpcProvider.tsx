import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '../lib/trpc';

const queryClient = new QueryClient();

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: import.meta.env.VITE_API_URL,
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
