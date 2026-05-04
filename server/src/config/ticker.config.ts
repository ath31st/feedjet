import type { TickerConfig } from '@shared/types/ticker.config.js';

/*
 * Default values for the ticker config
 *
 * kioskId: 0
 * text: "Lorem ipsum" text by default
 * isActive: false
 * speedPxPerSec: 50 (1-300px/sec)
 * direction: 'left' or 'right'
 * fontScale: 100 (50-300%)
 * textColor: '#ffffff'
 * backgroundColor: '#000000'
 * backgroundOpacity: 100 (0-100%)
 * height: 5 (2-50%)
 * positionY: 50 (0-100%)
 * paddingX: 0 (0-30%)
 * isLooped: true
 */
export const TICKER_DEFAULTS: TickerConfig = {
  kioskId: 0,
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  isActive: false,
  speedPxPerSec: 50,
  direction: 'left',
  fontScale: 100,
  textColor: '#ffffff',
  backgroundColor: '#000000',
  backgroundOpacity: 100,
  height: 5,
  positionY: 50,
  paddingX: 0,
  isLooped: true,
} as const;

export const TICKER_LIMITS = {
  text: { min: 1, max: 1000 },
  speedPxPerSec: { min: 1, max: 300 },
  fontScale: { min: 50, max: 300 },
  backgroundOpacity: { min: 0, max: 100 },
  height: { min: 2, max: 50 },
  positionY: { min: 0, max: 100 },
  paddingX: { min: 0, max: 30 },
  color: { min: 6, max: 10 },
} as const;
