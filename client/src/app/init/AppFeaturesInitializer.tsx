import { useEffect } from 'react';
import { useAppFeaturesStore } from '@/entities/app-features';

export function AppFeaturesInitializer() {
  const fetchFeatures = useAppFeaturesStore((s) => s.fetchFeatures);
  const initialized = useAppFeaturesStore((s) => s.initialized);

  useEffect(() => {
    if (!initialized) {
      void fetchFeatures();
    }
  }, [fetchFeatures, initialized]);

  return null;
}
