import {
  useGetUiConfig,
  useUpdateUiConfig,
  type SeasonOverlayMode,
} from '@/entities/ui-config';

export function useSeasonOverlaySelector(kioskId: number) {
  const { data: uiConfig, isLoading } = useGetUiConfig(kioskId);
  const updateUiConfig = useUpdateUiConfig();

  const handleChange = async (selected: SeasonOverlayMode) => {
    await updateUiConfig.mutateAsync({
      kioskId,
      data: { seasonOverlay: selected },
    });
  };

  return {
    seasonOverlay: (uiConfig?.seasonOverlay ?? 'auto') as SeasonOverlayMode,
    handleChange,
    isLoading: isLoading || updateUiConfig.isPending,
  };
}
