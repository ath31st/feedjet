import {
  useUiConfigStore,
  useUpdateUiConfig,
  type Theme,
} from '@/entities/ui-config';

export function useThemeSelector() {
  const { uiConfig, setConfig } = useUiConfigStore();
  const updateUiConfig = useUpdateUiConfig();

  const handleThemeChange = async (kioskId: number, selected: Theme) => {
    const updatedConfig = await updateUiConfig.mutateAsync({
      kioskId,
      data: { theme: selected },
    });
    setConfig({
      ...updatedConfig,
      createdAt: new Date(updatedConfig.createdAt),
      updatedAt: new Date(updatedConfig.updatedAt),
    });
  };

  return {
    theme: uiConfig?.theme ?? 'dark',
    handleThemeChange,
  };
}
