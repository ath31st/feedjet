import { useEffect } from 'react';
import { useVideoStore } from '..';

export function useVideoStoreInit() {
  const initStore = useVideoStore((s) => s.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);
}
