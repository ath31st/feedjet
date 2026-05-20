import {
  useGetUiConfig,
  useUpdateUiConfig,
  type ScreenRotation,
} from '@/entities/ui-config';

export function useScreenRotationSelector(kioskId: number) {
  const { data: uiConfig, isLoading } = useGetUiConfig(kioskId);
  const updateUiConfig = useUpdateUiConfig();

  const handleChange = async (selected: ScreenRotation) => {
    await updateUiConfig.mutateAsync({
      kioskId,
      data: { screenRotation: selected },
    });
  };

  const formatLabel = (value: ScreenRotation): string =>
    value === 0 ? '0°' : `${value > 0 ? '+' : ''}${value}°`;

  return {
    screenRotation: (uiConfig?.screenRotation ?? 0) as ScreenRotation,
    handleChange,
    isLoading: isLoading || updateUiConfig.isPending,
    formatLabel,
  };
}
