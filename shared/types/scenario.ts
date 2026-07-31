export const scenarioItemTypes = ['widget', 'image', 'video', 'pdf'] as const;
export type ScenarioItemType = (typeof scenarioItemTypes)[number];
export const scenarioWidgetTypes = [
  'schedule',
  'rss',
  'birthday',
  'info',
] as const;
export type ScenarioWidgetType = (typeof scenarioWidgetTypes)[number];

export interface ScenarioItem {
  id: number;
  scenarioId: number;
  type: ScenarioItemType;
  widgetType: ScenarioWidgetType | null;
  imageId: number | null;
  videoId: number | null;
  pdfId: number | null;
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
  videoThumbnail?: string | null;
  videoDuration?: number | null;
  pdfName?: string | null;
  pdfFileName?: string | null;
  pdfThumbnail?: string | null;
  pdfPageCount?: number | null;
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
  pdfId?: number;
  order: number;
  isActive: boolean;
  durationSeconds?: number;
}

type ReplaceScenarioItemBase = {
  id?: number;
  isActive: boolean;
  durationSeconds?: number;
};

export type ReplaceScenarioItemInput =
  | (ReplaceScenarioItemBase & {
      type: 'widget';
      widgetType: ScenarioWidgetType;
    })
  | (ReplaceScenarioItemBase & {
      type: 'image';
      imageId: number;
    })
  | (ReplaceScenarioItemBase & {
      type: 'video';
      videoId: number;
    })
  | (ReplaceScenarioItemBase & {
      type: 'pdf';
      pdfId: number;
    });
