import { WIDGET_ICONS, type ScenarioItem } from '@/entities/scenario';
import { ITEM_CONFIG } from '../ui/ItemTypeConfig';

export function useItemRow(item: ScenarioItem) {
  const config = ITEM_CONFIG[item.type] || ITEM_CONFIG.widget;

  const Icon =
    item.type === 'widget' && item.widgetType
      ? WIDGET_ICONS[item.widgetType] || config.Icon
      : config.Icon;

  return {
    config,
    Icon,
    label: config.getLabel(item),
    typeName: config.getTypeName,
    hasDuration: config.hasDuration,
    canPreview: config.canPreview,
  };
}
