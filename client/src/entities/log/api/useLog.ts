import { useQuery } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api';
import type { LogFilter } from '..';

export const useGetLogPage = (
  file?: string,
  filter: LogFilter = {},
  page?: number,
  pageSize?: number,
) => {
  return useQuery(
    trpcWithProxy.log.getLogPage.queryOptions({
      file,
      page,
      pageSize,
      filter,
    }),
  );
};

export const useGetLogFiles = () => {
  return useQuery(trpcWithProxy.log.getLogFiles.queryOptions());
};
