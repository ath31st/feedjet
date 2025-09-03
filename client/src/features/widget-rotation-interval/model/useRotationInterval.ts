import { useUpdateUiConfig, useUiConfigStore } from '@/entities/ui-config';

export function useRotationInterval(min = 10, max = 10000) {
  const { uiConfig, setConfig } = useUiConfigStore();
  const updateConfig = useUpdateUiConfig();

  const value = uiConfig?.autoSwitchIntervalMs
    ? Math.floor(uiConfig.autoSwitchIntervalMs / 1000)
    : 0;

  const update = async (val: number) => {
    const clamped = Math.min(Math.max(val, min), max);
    const updatedConfig = await updateConfig.mutateAsync({
      data: { autoSwitchIntervalMs: clamped * 1000 },
    });
    setConfig({
      ...updatedConfig,
      createdAt: new Date(updatedConfig.createdAt),
      updatedAt: new Date(updatedConfig.updatedAt),
    });
  };

  return { value, update };
}
