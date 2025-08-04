import { useEffect, useState } from 'react';

export function useCarousel<T>(
  items: T[] | undefined,
  visibleCount: number,
  intervalMs: number,
): T[] {
  const safeItems = Array.isArray(items) ? items : [];

  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (safeItems.length <= visibleCount) return;

    const id = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % safeItems.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [safeItems.length, visibleCount, intervalMs]);

  if (safeItems.length === 0) return [];

  const result: T[] = [];

  for (let i = 0; i < visibleCount; i++) {
    result.unshift(safeItems[(startIndex + i) % safeItems.length]);
  }

  return result;
}
