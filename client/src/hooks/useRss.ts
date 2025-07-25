// hooks/useRss.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpc } from '../lib/trpc';

export const useGetAllRss = () => {
  return useQuery(trpc.rss.getAll.queryOptions());
};

export const useGetActiveRss = () => {
  return useQuery(trpc.rss.getActive.queryOptions());
};

export const useFindRssById = (id: string | number) => {
  return useQuery(trpc.rss.findById.queryOptions({ id }));
};

export const useCreateRss = () => {
  return useMutation(
    trpc.rss.create.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: trpc.rss.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useUpdateRss = () => {
  return useMutation(
    trpc.rss.update.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: trpc.rss.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteRss = () => {
  return useMutation(
    trpc.rss.delete.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: trpc.rss.getAll.queryKey(),
        });
      },
    }),
  );
};
