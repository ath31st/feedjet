import { useEffect } from 'react';
import type { ScenarioItem } from '@shared/types/scenario';
import { buildImageUrl } from '@/entities/image';
import { findNextScenarioImageFileName } from '../lib/findNextScenarioImageFileName';

export function useScenarioImagePreload(
  items: ScenarioItem[],
  currentIndex: number,
) {
  useEffect(() => {
    const fileName = findNextScenarioImageFileName(items, currentIndex);
    if (!fileName) return;

    const img = new Image();
    img.src = buildImageUrl(fileName);
    void img.decode().catch(() => undefined);
  }, [items, currentIndex]);
}
