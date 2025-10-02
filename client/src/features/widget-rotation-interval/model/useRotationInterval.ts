import { useUpdateUiConfig, useGetUiConfig } from '@/entities/ui-config';

export function useRotationInterval(kioskId: number, min = 10, max = 10000) {
  const { data: uiConfig, isLoading } = useGetUiConfig(kioskId);
  const updateConfig = useUpdateUiConfig();

  const value = uiConfig?.autoSwitchIntervalMs
    ? Math.floor(uiConfig.autoSwitchIntervalMs / 1000)
    : 0;

  const update = async (val: number) => {
    const clamped = Math.min(Math.max(val, min), max);
    await updateConfig.mutateAsync({
      kioskId,
      data: { autoSwitchIntervalMs: clamped * 1000 },
    });
  };

  const isLoadingState = isLoading || updateConfig.isPending;

  return { value, update, isLoading: isLoadingState };
}
