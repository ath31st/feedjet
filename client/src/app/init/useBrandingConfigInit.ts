import { useEffect } from 'react';
import { useBrandingConfigStore } from '@/entities/branding';

export function useBrandingConfigStoreInit() {
  const fetchConfig = useBrandingConfigStore((s) => s.fetchConfig);
  const fetchLogo = useBrandingConfigStore((s) => s.fetchLogo);

  useEffect(() => {
    fetchConfig();
    fetchLogo();
  }, [fetchConfig, fetchLogo]);
}
