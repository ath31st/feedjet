import { useEffect } from 'react';
import { useDeviceStore } from '@/entities/device';

export function useDeviceStoreInit() {
  const initStore = useDeviceStore((s) => s.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);
}
