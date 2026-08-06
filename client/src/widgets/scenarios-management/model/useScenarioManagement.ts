import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useScenario,
  useReplaceScenarioItems,
  useScenarioCopyStore,
  nextTempScenarioItemId,
  isItemPlayableToday,
  type ScenarioItem,
  type ReplaceScenarioItemInput,
} from '@/entities/scenario';
import { useLocalToday } from '@/shared/lib';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { toast } from 'sonner';

function toReplacePayload(items: ScenarioItem[]): ReplaceScenarioItemInput[] {
  const result: ReplaceScenarioItemInput[] = [];

  for (const item of items) {
    const id = item.id > 0 ? item.id : undefined;
    const durationSeconds = item.durationSeconds ?? undefined;
    const activeFrom = item.activeFrom ?? null;
    const activeTo = item.activeTo ?? null;

    if (item.type === 'widget') {
      if (item.widgetType == null) continue;
      result.push({
        id,
        type: 'widget',
        widgetType: item.widgetType,
        isActive: item.isActive,
        durationSeconds,
        activeFrom,
        activeTo,
      });
      continue;
    }

    if (item.type === 'image') {
      if (item.imageId == null) continue;
      result.push({
        id,
        type: 'image',
        imageId: item.imageId,
        isActive: item.isActive,
        durationSeconds,
        activeFrom,
        activeTo,
      });
      continue;
    }

    if (item.type === 'video') {
      if (item.videoId == null) continue;
      result.push({
        id,
        type: 'video',
        videoId: item.videoId,
        isActive: item.isActive,
        durationSeconds,
        activeFrom,
        activeTo,
      });
      continue;
    }

    if (item.pdfId == null) continue;
    result.push({
      id,
      type: 'pdf',
      pdfId: item.pdfId,
      isActive: item.isActive,
      durationSeconds,
      activeFrom,
      activeTo,
    });
  }

  return result;
}

export function useScenarioManagement(effectiveKioskId: number) {
  const { data: scenario, isLoading } = useScenario(effectiveKioskId);
  const [localItems, setLocalItems] = useState<ScenarioItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const today = useLocalToday();

  const replaceItems = useReplaceScenarioItems(effectiveKioskId);
  const isCopyMode = useScenarioCopyStore((s) => s.isCopyMode);
  const setIsCopyMode = useScenarioCopyStore((s) => s.setIsCopyMode);
  const toggleCopyMode = useScenarioCopyStore((s) => s.toggleCopyMode);
  const registerCopyHandler = useScenarioCopyStore(
    (s) => s.registerCopyHandler,
  );
  const resetCopyStore = useScenarioCopyStore((s) => s.reset);

  // biome-ignore lint/correctness/useExhaustiveDependencies: effectiveKioskId needed here
  useEffect(() => {
    setIsDirty(false);
    setIsCopyMode(false);
  }, [effectiveKioskId, setIsCopyMode]);

  useEffect(() => {
    if (!scenario || isDirty) return;
    setLocalItems(scenario.items);
  }, [scenario, isDirty]);

  const handleCopyFromKiosk = useCallback(
    async (sourceKioskId: number) => {
      if (sourceKioskId === effectiveKioskId) {
        setIsCopyMode(false);
        return;
      }

      try {
        const source = await queryClient.fetchQuery(
          trpcWithProxy.scenario.getByKiosk.queryOptions({
            kioskId: sourceKioskId,
          }),
        );

        setLocalItems(
          source.items.map((item, index) => ({
            ...item,
            id: nextTempScenarioItemId(),
            scenarioId: scenario?.id ?? 0,
            order: index,
          })),
        );
        setIsDirty(true);
        setIsCopyMode(false);
        toast.success('Сценарий скопирован — сохраните изменения');
      } catch {
        toast.error('Не удалось скопировать сценарий');
        setIsCopyMode(false);
      }
    },
    [effectiveKioskId, scenario?.id, setIsCopyMode],
  );

  useEffect(() => {
    registerCopyHandler(handleCopyFromKiosk);
    return () => {
      resetCopyStore();
    };
  }, [handleCopyFromKiosk, registerCopyHandler, resetCopyStore]);

  const handleSave = () => {
    setIsCopyMode(false);
    replaceItems.mutate(
      {
        kioskId: effectiveKioskId,
        items: toReplacePayload(localItems),
      },
      {
        onSuccess: (items) => {
          setLocalItems(items);
          setIsDirty(false);
        },
      },
    );
  };

  const handleReset = () => {
    setIsCopyMode(false);
    setLocalItems(scenario?.items ?? []);
    setIsDirty(false);
  };

  const handleDeleteAll = () => {
    setLocalItems([]);
    setIsDirty(true);
  };

  const handleAddItems = (items: ScenarioItem[]) => {
    setLocalItems((prev) => [
      ...prev,
      ...items.map((item, index) => ({
        ...item,
        scenarioId: scenario?.id ?? item.scenarioId,
        order: prev.length + index,
      })),
    ]);
    setIsDirty(true);
  };

  const playableItems = useMemo(
    () => localItems.filter((i) => isItemPlayableToday(i, today)),
    [localItems, today],
  );

  const activeItemsCount = playableItems.length;
  const totalDuration = playableItems.reduce((sum, i) => {
    if (i.type === 'video') {
      return sum + (i.videoDuration ?? i.durationSeconds ?? 0);
    }

    if (i.type === 'pdf') {
      const pages = Math.max(1, i.pdfPageCount ?? 1);
      return sum + (i.durationSeconds ?? 10) * pages;
    }

    return sum + (i.durationSeconds ?? 10);
  }, 0);

  return {
    scenario,
    localItems,
    setLocalItems,
    isLoading,
    isDirty,
    setIsDirty,
    isCopyMode,
    toggleCopyMode,
    activeItemsCount,
    totalDuration,
    handleSave,
    handleReset,
    handleDeleteAll,
    handleAddItems,
    isSaving: replaceItems.isPending,
  };
}
