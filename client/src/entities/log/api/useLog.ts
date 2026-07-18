import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import type { LogFilter } from '..';
import { toast } from 'sonner';

export const useGetLogPage = (
  file?: string,
  filter: LogFilter = {},
  page?: number,
  pageSize?: number,
  refetchInterval?: number | false,
) => {
  return useQuery({
    ...trpcWithProxy.log.getLogPage.queryOptions({
      file,
      page,
      pageSize,
      filter,
    }),
    enabled: Boolean(file),
    refetchInterval: refetchInterval || false,
    placeholderData: (prev) => prev,
  });
};

export const useGetLogFiles = () => {
  return useQuery(trpcWithProxy.log.getLogFiles.queryOptions());
};

export const useGetLogSources = (file?: string) => {
  return useQuery({
    ...trpcWithProxy.log.getLogSources.queryOptions({
      file: file ?? 'current.log',
    }),
    enabled: Boolean(file),
  });
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
      onSuccess(result) {
        toast.success(
          result.deleted > 0
            ? `Удалено файлов: ${result.deleted}`
            : 'Нет файлов для удаления',
        );
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.log.getLogFiles.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.log.getLogPage.queryKey(),
        });
      },
    }),
  );
};

export const downloadLogFile = async (file: string) => {
  const content = await queryClient.fetchQuery(
    trpcWithProxy.log.downloadLogFile.queryOptions({ file }),
  );

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file;
  a.click();
  URL.revokeObjectURL(url);
};
