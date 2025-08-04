import { useEffect } from 'react';

export function useCarousel<T>(
  items: T[] | undefined,
  visibleCount: number,
  intervalMs: number,
  startIndex: number,
  setStartIndex: (fn: (prev: number) => number) => void,
): T[] {
  const safeItems = Array.isArray(items) ? items : [];

  useEffect(() => {
    if (safeItems.length <= visibleCount) return;

    const id = setInterval(() => {
      setStartIndex((prev: number) => {
        return (prev + 1) % safeItems.length;
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [safeItems.length, visibleCount, intervalMs, setStartIndex]);

  if (safeItems.length === 0) return [];

  const result: T[] = [];

  for (let i = 0; i < visibleCount; i++) {
    result.unshift(safeItems[(startIndex + i) % safeItems.length]);
  }

  return result;
}
