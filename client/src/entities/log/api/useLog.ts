import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import type { LogFilter } from '..';
import { toast } from 'sonner';

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

export const useDeleteLogFiles = () => {
  return useMutation(
    trpcWithProxy.log.deleteLogFiles.mutationOptions({ 
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при удалении файлов');
          return;
        }
      },
      onSuccess() {
        toast.success('Файлы успешно удалены');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.log.getLogFiles.queryKey(),
        });
      },
     }),
  );
}