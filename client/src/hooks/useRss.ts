// hooks/useRss.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from '../lib/trpc';

export const useGetAllRss = () => {
  return useQuery(trpc.rss.getAll.queryOptions());
};

export const useGetRssById = (id: string | number) => {
  return useQuery(trpc.rss.getById.queryOptions({ id }));
};

export const useCreateRss = () => {
  const queryClient = useQueryClient();
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
  const queryClient = useQueryClient();
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
  const queryClient = useQueryClient();
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
