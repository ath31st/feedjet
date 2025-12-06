import { useKioskStore } from '@/entities/kiosk/model/kioskStore';
import { useEffect } from 'react';

export function AdminInitializer() {
  const init = useKioskStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return null;
}
