import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@shared/trpc/router';

export const trpc = createTRPCReact<AppRouter>();
