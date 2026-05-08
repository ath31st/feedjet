export const scenarioItemTypes = ['widget', 'image', 'video'] as const;
export type ScenarioItemType = (typeof scenarioItemTypes)[number];
export const scenarioWidgetTypes = [
  'schedule',
  'rss',
  'birthday',
  'info',
  'weather',
] as const;
export type ScenarioWidgetType = (typeof scenarioWidgetTypes)[number];

export interface ScenarioItem {
  id: number;
  scenarioId: number;
  type: ScenarioItemType;
  widgetType: ScenarioWidgetType | null;
  imageId: number | null;
  videoId: number | null;
  order: number;
  isActive: boolean;
  durationSeconds: number | null;
  imageName?: string | null;
  imageFileName?: string | null;
  imageThumbnail?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  videoName?: string | null;
  videoFileName?: string | null;
  videoDuration?: number | null;
}

export interface Scenario {
  id: number;
  kioskId: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  items: ScenarioItem[];
}

export interface UpsertScenarioItemInput {
  type: ScenarioItemType;
  widgetType?: ScenarioWidgetType;
  imageId?: number;
  videoId?: number;
  order: number;
  isActive: boolean;
  durationSeconds?: number;
}
