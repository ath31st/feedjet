export const widgetTypes = ['schedule', 'birthdays', 'feed'] as const;
export type WidgetType = (typeof widgetTypes)[number];
