import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

const folderQueryKey = () => trpcWithProxy.mediaFolder.getTree.queryKey();
const mediaQueryKey = () => trpcWithProxy.mediaFolder.listMedia.queryKey();

export const useMediaFolderTree = () =>
  useQuery(trpcWithProxy.mediaFolder.getTree.queryOptions());

export const useMediaInFolder = (folderId: number | null) =>
  useQuery(trpcWithProxy.mediaFolder.listMedia.queryOptions({ folderId }));

export const useMediaStats = () =>
  useQuery(trpcWithProxy.mediaFolder.stats.queryOptions());

export const useCreateFolder = () =>
  useMutation(
    trpcWithProxy.mediaFolder.create.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: folderQueryKey() });
      },
    }),
  );

export const useRenameFolder = () =>
  useMutation(
    trpcWithProxy.mediaFolder.rename.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: folderQueryKey() });
      },
    }),
  );

export const useDeleteFolder = () =>
  useMutation(
    trpcWithProxy.mediaFolder.delete.mutationOptions({
      onSuccess() {
        toast.success('Папка удалена');
        queryClient.invalidateQueries({ queryKey: folderQueryKey() });
      },
    }),
  );

export const useAssignImageFolder = () =>
  useMutation(
    trpcWithProxy.mediaFolder.assignImageFolder.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: mediaQueryKey() });
      },
    }),
  );

export const useAssignVideoFolder = () =>
  useMutation(
    trpcWithProxy.mediaFolder.assignVideoFolder.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: mediaQueryKey() });
      },
    }),
  );
