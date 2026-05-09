import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

export const scenarioKey = (kioskId: number) =>
  trpcWithProxy.scenario.getByKiosk.queryKey({ kioskId });

export const useScenario = (kioskId: number) =>
  useQuery({
    ...trpcWithProxy.scenario.getByKiosk.queryOptions({ kioskId }),
    enabled: kioskId > 0,
  });

export const useAddScenarioItem = (kioskId: number) =>
  useMutation(
    trpcWithProxy.scenario.addItem.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: scenarioKey(kioskId) });
      },
    }),
  );

export const useUpdateScenarioItem = (kioskId: number) =>
  useMutation(
    trpcWithProxy.scenario.updateItem.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: scenarioKey(kioskId) });
      },
    }),
  );

export const useReorderScenarioItems = (kioskId: number) =>
  useMutation(
    trpcWithProxy.scenario.reorderItems.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: scenarioKey(kioskId) });
      },
    }),
  );

export const useDeleteScenarioItem = (kioskId: number) =>
  useMutation(
    trpcWithProxy.scenario.deleteItem.mutationOptions({
      onSuccess() {
        toast.success('Элемент удалён из сценария');
        queryClient.invalidateQueries({ queryKey: scenarioKey(kioskId) });
      },
    }),
  );

