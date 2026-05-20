import {
  useGetUiConfig,
  useUpdateUiConfig,
  type AnimationType,
} from '@/entities/ui-config';

export function useAnimationModeSelector(kioskId: number) {
  const { data: uiConfig, isLoading } = useGetUiConfig(kioskId);
  const updateUiConfig = useUpdateUiConfig();

  const handleChange = async (selected: AnimationType) => {
    await updateUiConfig.mutateAsync({
      kioskId,
      data: { animationMode: selected },
    });
  };

  return {
    animationMode: (uiConfig?.animationMode ?? 'full') as AnimationType,
    handleChange,
    isLoading: isLoading || updateUiConfig.isPending,
  };
}
