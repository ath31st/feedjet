import { useEffect } from 'react';
import { useVideoStore } from '@/entities/video';

export function useVideoStoreInit() {
  const initStore = useVideoStore((s) => s.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);
}
