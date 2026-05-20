import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import type { ScenarioItem } from '@shared/types/scenario';
import { useScenarioStore } from '@/entities/scenario';
import { useUiConfigStore } from '@/entities/ui-config';

export function useScenarioRotation() {
  const rotate = useUiConfigStore((s) => s.uiConfig.screenRotation);
  const animation = useUiConfigStore((s) => s.uiConfig.animationMode);
  const seasonOverlay = useUiConfigStore((s) => s.uiConfig.seasonOverlay);
  const { scenario, loading: scenarioLoading } = useScenarioStore();
  const items: ScenarioItem[] = (scenario?.items ?? []).filter(
    (i) => i.isActive,
  );
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [isRotationLocked, setIsRotationLocked] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const safeIndex = useMemo(() => {
    if (items.length === 0) return 0;
    const idx = items.findIndex((i) => i.id === currentItemId);
    return idx === -1 ? 0 : idx;
  }, [items, currentItemId]);

  const currentItem = items[safeIndex] ?? null;

  useEffect(() => {
    if (items.length === 0) {
      if (currentItemId !== null) setCurrentItemId(null);
      return;
    }

    const exists = items.some((i) => i.id === currentItemId);
    if (!exists) {
      setCurrentItemId(items[0].id);
    }
  }, [items, currentItemId]);

  const lockRotation = useEffectEvent(() => {
    setIsRotationLocked(true);
  });

  const unlockRotation = useEffectEvent(() => {
    setIsRotationLocked(false);

    if (items.length === 0) {
      setCurrentItemId(null);
      return;
    }

    const idx = items.findIndex((i) => i.id === currentItemId);
    const nextIdx = (Math.max(0, idx) + 1) % items.length;
    setCurrentItemId(items[nextIdx].id);
  });

  const advance = useEffectEvent(() => {
    if (isRotationLocked || userPaused || items.length === 0) {
      return;
    }

    const idx = items.findIndex((i) => i.id === currentItemId);
    const nextIdx = (Math.max(0, idx) + 1) % items.length;
    setCurrentItemId(items[nextIdx].id);
  });

  const next = useEffectEvent(() => {
    if (items.length === 0) return;

    const idx = items.findIndex((i) => i.id === currentItemId);
    const nextIdx = (Math.max(0, idx) + 1) % items.length;
    setCurrentItemId(items[nextIdx].id);
  });

  const prev = useEffectEvent(() => {
    if (items.length === 0) return;

    const idx = items.findIndex((i) => i.id === currentItemId);
    const base = idx === -1 ? 0 : idx;
    const prevIdx = (base - 1 + items.length) % items.length;
    setCurrentItemId(items[prevIdx].id);
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

  const setIndex = useEffectEvent((idx: number) => {
    if (items.length === 0) return;
    const target = items[Math.max(0, Math.min(idx, items.length - 1))];
    if (target) setCurrentItemId(target.id);
  });

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
    rotate,
    animation,
    seasonOverlay,
  };
}
