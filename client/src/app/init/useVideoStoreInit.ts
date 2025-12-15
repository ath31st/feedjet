import { useEffect } from 'react';
import { useVideoStore } from '@/entities/video';

export function useVideoStoreInit(kioskId: number) {
  const initStore = useVideoStore((s) => s.initStore);

  useEffect(() => {
    initStore(kioskId);
  }, [initStore, kioskId]);
}
