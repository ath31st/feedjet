export const tickerDirections = ['left', 'right'] as const;
export type TickerDirection = (typeof tickerDirections)[number];

export interface TickerConfig {
  kioskId: number;
  text: string;
  isActive: boolean;
  speedPxPerSec: number;
  direction: TickerDirection;
  fontScale: number;
  textColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  height: number;
  positionY: number;
  paddingX: number;
  isLooped: boolean;
}

export interface NewTickerConfig {
  text: string;
  isActive?: boolean;
  speedPxPerSec?: number;
  direction: TickerDirection;
  fontScale?: number;
  textColor?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  height?: number;
  positionY?: number;
  paddingX?: number;
  isLooped?: boolean;
}

export interface UpdateTickerConfig {
  text?: string;
  isActive?: boolean;
  speedPxPerSec?: number;
  direction?: TickerDirection;
  fontScale?: number;
  textColor?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  height?: number;
  positionY?: number;
  paddingX?: number;
  isLooped?: boolean;
}
