import { useState, useEffect } from 'react';
import {
  useScenario,
  useReplaceScenarioItems,
  type ScenarioItem,
  type ReplaceScenarioItemInput,
} from '@/entities/scenario';

function toReplacePayload(items: ScenarioItem[]): ReplaceScenarioItemInput[] {
  return items.flatMap((item) => {
    const id = item.id > 0 ? item.id : undefined;
    const base = {
      id,
      isActive: item.isActive,
      durationSeconds: item.durationSeconds ?? undefined,
    };

    if (item.type === 'widget') {
      if (item.widgetType == null) return [];
      return [
        {
          ...base,
          type: 'widget' as const,
          widgetType: item.widgetType,
        },
      ];
    }

    if (item.type === 'image') {
      if (item.imageId == null) return [];
      return [
        {
          ...base,
          type: 'image' as const,
          imageId: item.imageId,
        },
      ];
    }

    if (item.videoId == null) return [];
    return [
      {
        ...base,
        type: 'video' as const,
        videoId: item.videoId,
      },
    ];
  });
}

export function useScenarioManagement(effectiveKioskId: number) {
  const { data: scenario, isLoading } = useScenario(effectiveKioskId);
  const [localItems, setLocalItems] = useState<ScenarioItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const replaceItems = useReplaceScenarioItems(effectiveKioskId);

  useEffect(() => {
    setIsDirty(false);
  }, [effectiveKioskId]);

  useEffect(() => {
    if (!scenario || isDirty) return;
    setLocalItems(scenario.items);
  }, [scenario, isDirty]);

  const handleSave = () => {
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

  const activeItemsCount = localItems.filter((i) => i.isActive).length;
  const totalDuration = localItems
    .filter((i) => i.isActive)
    .reduce((sum, i) => {
      if (i.type === 'video') {
        return sum + (i.videoDuration ?? i.durationSeconds ?? 0);
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
    activeItemsCount,
    totalDuration,
    handleSave,
    handleReset,
    handleDeleteAll,
    handleAddItems,
    isSaving: replaceItems.isPending,
  };
}
