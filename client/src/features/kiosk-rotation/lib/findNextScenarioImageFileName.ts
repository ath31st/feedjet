import type { ScenarioItem } from '@shared/types/scenario';

/** Nearest upcoming image item (ring), skipping the current slot. */
export function findNextScenarioImageFileName(
  items: ScenarioItem[],
  currentIndex: number,
): string | null {
  if (items.length < 2) return null;

  for (let offset = 1; offset < items.length; offset++) {
    const item = items[(currentIndex + offset) % items.length];
    if (item?.type === 'image' && item.imageFileName) {
      return item.imageFileName;
    }
  }

  return null;
}
