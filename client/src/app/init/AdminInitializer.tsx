import { useKioskStore } from '@/entities/kiosk/model/kioskStore';
import { useUiConfigStore } from '@/entities/ui-config';
import { useEffect } from 'react';
import { useKioskInitialization } from './useKioskInitialization';

export function AdminInitializer() {
  useKioskInitialization();

  const fetchUiConfig = useUiConfigStore((s) => s.fetchUiConfig);
  const currentKiosk = useKioskStore((s) => s.currentKiosk);

  useEffect(() => {
    if (currentKiosk) {
      fetchUiConfig(currentKiosk.id);
    }
  }, [currentKiosk, fetchUiConfig]);

  return null;
}
