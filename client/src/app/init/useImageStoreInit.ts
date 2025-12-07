import { useEffect } from 'react';
import { useImageStore } from '@/entities/image';

export function useImageStoreInit(kioskId: number) {
  const initStore = useImageStore((s) => s.initStore);

  useEffect(() => {
    initStore(kioskId);
  }, [initStore, kioskId]);
}
