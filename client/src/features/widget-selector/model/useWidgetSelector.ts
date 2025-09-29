import {
  useGetUiConfig,
  useUpdateUiConfig,
  type WidgetType,
} from '@/entities/ui-config';

export function useWidgetSelector(kioskId: number) {
  const { data: uiConfig, isLoading } = useGetUiConfig(kioskId);
  const updateUiConfig = useUpdateUiConfig();

  const handleWidgetChange = async (selected: WidgetType[]) => {
    await updateUiConfig.mutateAsync({
      kioskId,
      data: { rotatingWidgets: selected },
    });
  };

  const isLoadingState = isLoading || updateUiConfig.isPending;

  return {
    rotatingWidgets: uiConfig?.rotatingWidgets ?? [],
    handleWidgetChange,
    isLoading: isLoadingState,
  };
}
