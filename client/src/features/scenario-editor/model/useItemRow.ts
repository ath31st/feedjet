import { useAppFeaturesStore } from '@/entities/app-features';
import {
  getWidgetPresentation,
  type ScenarioItem,
} from '@/entities/scenario';
import { ITEM_CONFIG } from '../ui/ItemTypeConfig';

export function useItemRow(item: ScenarioItem) {
  const offlineMode = useAppFeaturesStore((s) => s.offlineMode);
  const config = ITEM_CONFIG[item.type] || ITEM_CONFIG.widget;

  const widgetPresentation =
    item.type === 'widget' && item.widgetType
      ? getWidgetPresentation(item.widgetType, offlineMode)
      : null;

  const Icon = widgetPresentation?.Icon ?? config.Icon;
  const label = widgetPresentation?.label ?? config.getLabel(item);

  return {
    config,
    Icon,
    label,
    typeName: config.getTypeName,
    hasDuration: config.hasDuration,
    canPreview: config.canPreview,
  };
}
