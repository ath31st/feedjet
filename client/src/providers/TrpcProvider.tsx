import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/trpc';

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
