import { useMutation } from '@tanstack/react-query';
import { trpcWithProxy } from '../../../shared/api/trpc/trpc';
import { toast } from 'sonner';

export function useSwitchWidget() {
  return useMutation(
    trpcWithProxy.control.switchWidget.mutationOptions({
      onSuccess() {
        toast.success('Виджет киоска изменен');
      },
      onError() {
        toast.error('Не удалось сменить виджет');
      },
    }),
  );
}
