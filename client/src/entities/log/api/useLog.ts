import { useQuery } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api';
import type { LogFilter } from '..';

export const useGetLogPage = (
  cursor?: string,
  filter: LogFilter = {},
  limit?: number,
) => {
  return useQuery(
    trpcWithProxy.log.getLogPage.queryOptions({
      cursor,
      filter,
      limit,
    }),
  );
};
