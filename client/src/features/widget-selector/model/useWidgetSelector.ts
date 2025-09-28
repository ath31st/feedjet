import {
  useUiConfigStore,
  useUpdateUiConfig,
  type WidgetType,
} from '@/entities/ui-config';

export function useWidgetSelector(kioskId: number) {
  const { uiConfig, setConfig } = useUiConfigStore();
  const updateUiConfig = useUpdateUiConfig();

  const handleWidgetChange = async (selected: WidgetType[]) => {
    const updatedConfig = await updateUiConfig.mutateAsync({
      kioskId,
      data: { rotatingWidgets: selected },
    });
    setConfig({
      ...updatedConfig,
      createdAt: new Date(updatedConfig.createdAt),
      updatedAt: new Date(updatedConfig.updatedAt),
    });
  };

  return {
    rotatingWidgets: uiConfig?.rotatingWidgets ?? [],
    handleWidgetChange,
  };
}
