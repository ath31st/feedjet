import { useEffect } from 'react';
import { useScenarioStore } from '@/entities/scenario';

export function useScenarioStoreInit(kioskId: number) {
  const initStore = useScenarioStore((s) => s.initStore);

  useEffect(() => {
    initStore(kioskId);
  }, [initStore, kioskId]);
}
