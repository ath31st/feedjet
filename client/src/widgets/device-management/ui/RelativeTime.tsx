import { fmtRelative, getRelativeColor } from '@/shared/lib';
import { useEffect, useState } from 'react';

export function RelativeTime({ date }: { date: Date | string | number }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((v) => v + 1);
    }, 10_000);

    return () => clearInterval(id);
  }, []);

  return <span className={getRelativeColor(date)}>{fmtRelative(date)}</span>;
}
