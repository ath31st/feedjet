import { useEffect, useState } from 'react';

export function useCarousel<T>(
  items: T[],
  pageSize: number,
  pagesCount: number,
  intervalMs: number,
) {
  const [page, setPage] = useState(0);

  const maxPages = Math.min(Math.ceil(items.length / pageSize), pagesCount);

  useEffect(() => {
    if (maxPages < 2) return;

    const id = setInterval(() => {
      setPage((p) => (p + 1) % maxPages);
    }, intervalMs);

    return () => clearInterval(id);
  }, [maxPages, intervalMs]);

  const start = page * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
}
