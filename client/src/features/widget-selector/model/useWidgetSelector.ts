import {
  useUiConfigStore,
  useUpdateUiConfig,
  type WidgetType,
} from '@/entities/ui-config';

export function useWidgetSelector() {
  const { uiConfig, setConfig } = useUiConfigStore();
  const updateUiConfig = useUpdateUiConfig();

  const handleWidgetChange = async (selected: WidgetType[]) => {
    const updatedConfig = await updateUiConfig.mutateAsync({
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
