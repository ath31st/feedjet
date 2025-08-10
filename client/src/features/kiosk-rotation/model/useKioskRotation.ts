import { useEffect, useState } from 'react';

interface UseKioskRotationProps {
  widgets: string[];
  interval: number;
}

export function useKioskRotation({ widgets, interval }: UseKioskRotationProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!interval || widgets.length < 2) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % widgets.length);
    }, interval);

    return () => clearInterval(id);
  }, [interval, widgets]);

  useEffect(() => {
    if (index >= widgets.length) {
      setIndex(0);
    }
  }, [widgets, index]);

  return { index, setIndex };
}
