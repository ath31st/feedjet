import { useEffect, useEffectEvent, useState } from 'react';

interface UseKioskRotationProps {
  widgets: string[];
  interval: number;
}

export function useKioskRotation({ widgets, interval }: UseKioskRotationProps) {
  const [index, setIndex] = useState(0);
  const [isRotationLocked, setIsRotationLocked] = useState(false);

  const lockRotation = useEffectEvent(() => {
    setIsRotationLocked(true);
  });

  const unlockRotation = useEffectEvent(() => {
    setIsRotationLocked(false);
    setIndex((prev) => (prev + 1) % widgets.length);
  });

  const onTick = useEffectEvent(() => {
    if (isRotationLocked) {
      return;
    }
    setIndex((prev) => (prev + 1) % widgets.length);
  });

  useEffect(() => {
    if (!interval || widgets.length < 2 || isRotationLocked) return;
    const id = setInterval(onTick, interval);
    return () => clearInterval(id);
  }, [interval, widgets.length, isRotationLocked]);

  useEffect(() => {
    if (index >= widgets.length && widgets.length > 0) {
      setIndex(0);
    }
  }, [widgets.length, index]);

  const isSingleVideoWidget = widgets.length === 1 && widgets[0] === 'video';
  const isSingleImageWidget = widgets.length === 1 && widgets[0] === 'image';

  return {
    index,
    setIndex,
    lockRotation,
    unlockRotation,
    isRotationLocked,
    isSingleVideoWidget,
    isSingleImageWidget,
  };
}
