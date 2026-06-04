import { useState, useEffect } from 'react';
import { useScenario, useReorderScenarioItems } from '@/entities/scenario';
import type { ScenarioItem } from '@/entities/scenario';

export function useScenarioManagement(effectiveKioskId: number) {
  const { data: scenario, isLoading } = useScenario(effectiveKioskId);
  const [localItems, setLocalItems] = useState<ScenarioItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const reorder = useReorderScenarioItems(effectiveKioskId);

  useEffect(() => {
    if (scenario) {
      setLocalItems(scenario.items);
      setIsDirty(false);
    }
  }, [scenario]);

  const handleSave = () => {
    reorder.mutate(
      {
        kioskId: effectiveKioskId,
        orderedIds: localItems.map((i) => i.id),
      },
      {
        onSuccess: () => {
          setIsDirty(false);
        },
      },
    );
  };

  const handleReset = () => {
    setLocalItems(scenario?.items ?? []);
    setIsDirty(false);
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
  };
}
