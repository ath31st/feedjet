import { useEffect, useEffectEvent } from 'react';

export function useCarousel<T>(
  items: T[] | undefined,
  visibleCount: number,
  intervalMs: number,
  startIndex: number,
  setStartIndex: (fn: (prev: number) => number) => void,
): T[] {
  const safeItems = Array.isArray(items) ? items : [];

  const onTick = useEffectEvent(() => {
    setStartIndex((prev: number) => (prev + 1) % safeItems.length);
  });

  useEffect(() => {
    if (safeItems.length <= visibleCount) return;
    const id = setInterval(onTick, intervalMs);
    return () => clearInterval(id);
  }, [safeItems.length, visibleCount, intervalMs]);

  if (safeItems.length === 0) return [];
  const result: T[] = [];
  for (let i = 0; i < visibleCount; i++) {
    result.unshift(safeItems[(startIndex + i) % safeItems.length]);
  }
  return result;
}
