import { useKioskStore } from '@/entities/kiosk';
import { useAppFeaturesStore } from '@/entities/app-features';

export function useAdminPageGate() {
  const kiosk = useKioskStore((s) => s.currentKiosk);
  const isKioskLoading = useKioskStore((s) => s.loading);
  const offlineMode = useAppFeaturesStore((s) => s.offlineMode);
  const featuresInitialized = useAppFeaturesStore((s) => s.initialized);

  const ready = !isKioskLoading && !!kiosk && featuresInitialized;

  return {
    ready,
    kiosk,
    offlineMode,
  };
}
