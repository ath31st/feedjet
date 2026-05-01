import { useEffect } from 'react';
import { useTickerConfigStore } from '@/entities/ticker-config';

export function useTickerConfigStoreInit(kioskId: number) {
  const initStore = useTickerConfigStore((s) => s.initStore);

  useEffect(() => {
    initStore(kioskId);
  }, [initStore, kioskId]);
}
