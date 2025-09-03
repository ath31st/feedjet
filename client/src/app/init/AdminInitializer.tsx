import { useFeedConfigSse } from '@/entities/feed-config';
import { useUiConfigStore } from '@/entities/ui-config';
import { useEffect } from 'react';

export function AdminInitializer() {
  const fetchUiConfig = useUiConfigStore((s) => s.fetchUiConfig);

  useEffect(() => {
    fetchUiConfig();
  }, [fetchUiConfig]);

  useFeedConfigSse();
  return null;
}
