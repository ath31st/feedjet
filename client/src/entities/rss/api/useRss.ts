import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api/trpc/trpc';
import { toast } from 'sonner';

export const useGetAllRss = () => {
  return useQuery(trpcWithProxy.rss.getAll.queryOptions());
};

export const useGetActiveRss = () => {
  return useQuery(trpcWithProxy.rss.getActive.queryOptions());
};

export const useFindRssById = (id: string | number) => {
  return useQuery(trpcWithProxy.rss.findById.queryOptions({ id }));
};

export const useCreateRss = () => {
  return useMutation(
    trpcWithProxy.rss.create.mutationOptions({
      onSuccess() {
        toast.success('RSS успешно добавлен');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.rss.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useUpdateRss = () => {
  return useMutation(
    trpcWithProxy.rss.update.mutationOptions({
      onSuccess() {
        toast.success('RSS успешно обновлен');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.rss.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteRss = () => {
  return useMutation(
    trpcWithProxy.rss.delete.mutationOptions({
      onSuccess() {
        toast.success('RSS успешно удален');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.rss.getAll.queryKey(),
        });
      },
    }),
  );
};
