import type { TickerConfig } from '@shared/types/ticker.config.js';

/*
 * Default values for the ticker config
 *
 * kioskId: 0
 * text: is an empty string by default
 * isActive: false
 * speedPxPerSec: 50 (1-600px/sec)
 * direction: 'left' or 'right'
 * fontScale: 100 (50-300%)
 * textColor: '#ffffff'
 * backgroundColor: '#000000'
 * backgroundOpacity: 100 (0-100%)
 * height: 5 (0-100%)
 * positionY: 0 (0-2000px)
 * paddingX: 0 (0-200px)
 * isLooped: true
 */
export const TICKER_DEFAULTS: TickerConfig = {
  kioskId: 0,
  text: '',
  isActive: false,
  speedPxPerSec: 50,
  direction: 'left',
  fontScale: 100,
  textColor: '#ffffff',
  backgroundColor: '#000000',
  backgroundOpacity: 100,
  height: 5,
  positionY: 0,
  paddingX: 0,
  isLooped: true,
} as const;

export const TICKER_LIMITS = {
  text: { min: 1, max: 1000 },
  speedPxPerSec: { min: 1, max: 600 },
  fontScale: { min: 50, max: 300 },
  backgroundOpacity: { min: 0, max: 100 },
  height: { min: 0, max: 100 },
  positionY: { min: 0, max: 2000 },
  paddingX: { min: 0, max: 200 },
  color: { min: 6, max: 10 },
} as const;
