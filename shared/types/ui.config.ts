export interface UiConfig {
  id: number;
  activeWidget: WidgetType;
  rotatingWidgets: WidgetType[];
  autoSwitchIntervalMs: number;
  theme: Theme;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUiConfig {
  activeWidget: string;
  theme: string;
  autoSwitchIntervalMs: number;
}

export interface UpdateUiConfig {
  activeWidget?: WidgetType;
  theme?: Theme;
  rotatingWidgets?: WidgetType[];
  autoSwitchIntervalMs?: number;
}

export const themes = ['dark', 'light', 'green', 'blue', 'sepia'];
export type Theme = (typeof themes)[number];

export const widgetTypes = ['schedule', 'birthdays', 'feed'];
export type WidgetType = (typeof widgetTypes)[number];
