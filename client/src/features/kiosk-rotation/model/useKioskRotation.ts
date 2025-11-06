import { useEffect, useEffectEvent, useState } from 'react';

interface UseKioskRotationProps {
  widgets: string[];
  interval: number;
}

export function useKioskRotation({ widgets, interval }: UseKioskRotationProps) {
  const [index, setIndex] = useState(0);

  const onTick = useEffectEvent(() => {
    setIndex((prev) => (prev + 1) % widgets.length);
  });

  useEffect(() => {
    if (!interval || widgets.length < 2) return;
    const id = setInterval(onTick, interval);
    return () => clearInterval(id);
  }, [interval, widgets.length]);

  useEffect(() => {
    if (index >= widgets.length && widgets.length > 0) {
      setIndex(0);
    }
  }, [widgets.length, index]);

  return { index, setIndex };
}
