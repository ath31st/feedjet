import { useEffect } from 'react';
import { useUiConfigStore } from '@/entities/ui-config/model/uiConfigStore';

export function useUiConfigStoreInit(kioskId: number) {
  const fetchUiConfig = useUiConfigStore((s) => s.fetchUiConfig);

  useEffect(() => {
    fetchUiConfig(kioskId);
  }, [fetchUiConfig, kioskId]);
}
