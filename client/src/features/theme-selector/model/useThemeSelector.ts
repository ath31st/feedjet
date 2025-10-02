import {
  useGetUiConfig,
  useUpdateUiConfig,
  type Theme,
} from '@/entities/ui-config';

export function useThemeSelector(kioskId: number) {
  const { data: uiConfig, isLoading } = useGetUiConfig(kioskId);
  const updateUiConfig = useUpdateUiConfig();

  const handleThemeChange = async (kioskId: number, selected: Theme) => {
    await updateUiConfig.mutateAsync({
      kioskId,
      data: { theme: selected },
    });
  };
  const isLoadingState = isLoading || updateUiConfig.isPending;

  return {
    theme: uiConfig?.theme ?? 'dark',
    handleThemeChange,
    isLoading: isLoadingState,
  };
}
