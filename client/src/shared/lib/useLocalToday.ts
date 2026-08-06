import { useEffect, useState } from 'react';
import { fmtLocalDateYmd } from './formatters';

const TICK_MS = 60_000;

/** Local YYYY-MM-DD that updates around midnight without a full reload. */
export function useLocalToday(): string {
  const [today, setToday] = useState(() => fmtLocalDateYmd());

  useEffect(() => {
    const sync = () => {
      const next = fmtLocalDateYmd();
      setToday((prev) => (prev === next ? prev : next));
    };

    sync();
    const id = window.setInterval(sync, TICK_MS);
    document.addEventListener('visibilitychange', sync);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return today;
}
