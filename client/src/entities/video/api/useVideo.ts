import { useQuery, useMutation } from '@tanstack/react-query';
import { trpcWithProxy, queryClient } from '@/shared/api/trpc';
import { toast } from 'sonner';

export const useFileList = () => {
  return useQuery(trpcWithProxy.file.listFiles.queryOptions());
};

export const useUploadFile = () => {
  return useMutation(
    trpcWithProxy.file.uploadFile.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Файл успешно загружен: ${data.path}`);
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.file.listFiles.queryKey(),
        });
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message || 'Ошибка при загрузке файла');
          return;
        }
      },
    }),
  );
};
