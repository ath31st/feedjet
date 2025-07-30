import { useEffect, useState } from 'react';
import {
  useUiConfigStore,
  useUpdateUiConfig,
  type WidgetType,
} from '@/entities/ui-config';

export function useWidgetSelector() {
  const [rotatingWidgets, setRotatingWidgets] = useState<WidgetType[]>([]);
  const { uiConfig } = useUiConfigStore();
  const updateUiConfig = useUpdateUiConfig();

  const handleWidgetChange = (selected: WidgetType[]) => {
    setRotatingWidgets(selected);
    updateUiConfig.mutate({ data: { rotatingWidgets: selected } });
  };

  useEffect(() => {
    if (uiConfig?.rotatingWidgets) {
      setRotatingWidgets(uiConfig.rotatingWidgets);
    }
  }, [uiConfig]);

  return {
    rotatingWidgets,
    handleWidgetChange,
  };
}
