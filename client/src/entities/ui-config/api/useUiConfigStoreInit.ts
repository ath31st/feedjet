import { useEffect } from 'react';
import { useUiConfigStore } from '../model/uiConfigStore';
import { useKioskStore } from '@/entities/kiosk';

export function useUiConfigStoreInit() {
  const fetchUiConfig = useUiConfigStore((s) => s.fetchUiConfig);
  const { currentKiosk, loading } = useKioskStore();

  useEffect(() => {
    if (currentKiosk && !loading) {
      fetchUiConfig(currentKiosk.id);
    }
  }, [fetchUiConfig, currentKiosk, loading]);
}
