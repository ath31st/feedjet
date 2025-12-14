import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

export const useGetAllKiosks = () => {
  return useQuery(trpcWithProxy.kiosk.getAll.queryOptions());
};

export const useDeleteKiosk = () => {
  return useMutation(
    trpcWithProxy.kiosk.delete.mutationOptions({
      onSuccess() {
        toast.success('Киоск успешно удален');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.kiosk.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useDeleteKioskBySlug = () => {
  return useMutation(
    trpcWithProxy.kiosk.deleteBySlug.mutationOptions({
      onSuccess() {
        toast.success('Киоск успешно удален');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.kiosk.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useCreateKiosk = () => {
  return useMutation(
    trpcWithProxy.kiosk.create.mutationOptions({
      onSuccess() {
        toast.success('Киоск успешно добавлен');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.kiosk.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useUpdateKiosk = () => {
  return useMutation(
    trpcWithProxy.kiosk.update.mutationOptions({
      onSuccess() {
        toast.success('Киоск успешно обновлен');
        queryClient.invalidateQueries({
          queryKey: trpcWithProxy.kiosk.getAll.queryKey(),
        });
      },
    }),
  );
};

export const useGetKioskBySlug = (slug: string) => {
  return useQuery(trpcWithProxy.kiosk.getBySlug.queryOptions({ slug }));
};
