import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import type { ScenarioItem } from '@shared/types/scenario';
import { useScenarioStore } from '@/entities/scenario';

export function useScenarioRotation() {
  const { scenario, loading: scenarioLoading } = useScenarioStore();
  const items: ScenarioItem[] = (scenario?.items ?? []).filter(
    (i) => i.isActive,
  );
  const [index, setIndex] = useState(0);
  const [isRotationLocked, setIsRotationLocked] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const safeIndex = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.min(index, items.length - 1);
  }, [index, items.length]);

  const currentItem = items[safeIndex] ?? null;

  useEffect(() => {
    if (index !== safeIndex) {
      setIndex(safeIndex);
    }
  }, [index, safeIndex]);

  const lockRotation = useEffectEvent(() => {
    setIsRotationLocked(true);
  });

  const unlockRotation = useEffectEvent(() => {
    setIsRotationLocked(false);

    if (items.length === 0) {
      setIndex(0);
      return;
    }

    setIndex((prev) => (prev + 1) % items.length);
  });

  const advance = useEffectEvent(() => {
    if (isRotationLocked || userPaused || items.length === 0) {
      return;
    }

    setIndex((prev) => (prev + 1) % items.length);
  });

  const next = useEffectEvent(() => {
    if (items.length === 0) return;

    setIndex((prev) => (prev + 1) % items.length);
  });

  const prev = useEffectEvent(() => {
    if (items.length === 0) return;

    setIndex((prev) => (prev - 1 + items.length) % items.length);
  });

  const togglePause = useEffectEvent(() => {
    setUserPaused((prev) => !prev);
  });

  useEffect(() => {
    if (items.length < 2 || isRotationLocked || userPaused || !currentItem) {
      return;
    }

    if (currentItem.type === 'video') {
      return;
    }

    const seconds = Math.max(1, currentItem.durationSeconds ?? 10);

    const timeoutId = window.setTimeout(() => {
      advance();
    }, seconds * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    currentItem?.id,
    currentItem?.durationSeconds,
    currentItem?.type,
    isRotationLocked,
    items.length,
    userPaused,
    currentItem,
  ]);

  return {
    scenarioLoading,
    currentItem,
    index: safeIndex,
    setIndex,
    lockRotation,
    unlockRotation,
    isRotationLocked,
    userPaused,
    togglePause,
    next,
    prev,
  };
}
