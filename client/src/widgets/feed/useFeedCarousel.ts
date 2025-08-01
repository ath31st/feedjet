import { useEffect, useState } from 'react';

export function useCarousel<T>(
  items: T[],
  pageSize: number,
  intervalMs: number,
) {
  const [page, setPage] = useState(0);
  const total = Math.ceil(items.length / pageSize);

  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % total);
    }, intervalMs);
    return () => clearInterval(id);
  }, [total, intervalMs]);

  const slice = items.slice(page * pageSize, page * pageSize + pageSize);
  return slice;
}
