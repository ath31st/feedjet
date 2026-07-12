import { useKioskStore } from '@/entities/kiosk';
import { useKioskInitialization } from './useKioskInitialization';
import { KioskModulesInitializer } from './KioskModulesInitializer';
import { useBrandingConfigStoreInit } from './useBrandingConfigInit';

export function KioskInitializer() {
  useBrandingConfigStoreInit();
  useKioskInitialization();

  const kiosk = useKioskStore((s) => s.currentKiosk);

  if (!kiosk) {
    return null;
  }

  return <KioskModulesInitializer kioskId={kiosk.id} />;
}
