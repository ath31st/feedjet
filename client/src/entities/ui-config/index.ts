export type {
  WidgetType,
  widgetTypes,
  Theme,
  UiConfig,
} from '@shared/types/ui.config';
export { themes, themesFull } from '@shared/types/ui.config';
export { useUiConfigStore } from './model/uiConfigStore';
export { useUiConfigSse } from './api/useUiConfigSse';
export * from './api/useUiConfig';
