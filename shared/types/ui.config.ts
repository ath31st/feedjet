export interface UiConfig {
  id: number;
  rotatingWidgets: WidgetType[];
  autoSwitchIntervalMs: number;
  theme: Theme;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUiConfig {
  theme: Theme;
  rotatingWidgets: WidgetType[];
  autoSwitchIntervalMs: number;
}

export interface UpdateUiConfig {
  theme?: Theme;
  rotatingWidgets?: WidgetType[];
  autoSwitchIntervalMs?: number;
}

export const themes = ['dark', 'light', 'green', 'blue', 'sepia'];
export type Theme = (typeof themes)[number];

export const widgetTypes = ['schedule', 'video', 'feed'];
export type WidgetType = (typeof widgetTypes)[number];

export const widgetLabels: Record<WidgetType, string> = {
  schedule: 'Расписание',
  video: 'Видео',
  feed: 'Новости',
};
