import { useEffect } from 'react';
import { useFeedConfigStore } from '..';
import { useKioskStore } from '@/entities/kiosk';

export function useFeedConfigStoreInit() {
  const fetchFeedConfig = useFeedConfigStore((s) => s.fetchFeedConfig);
  const { currentKiosk, loading } = useKioskStore();

  useEffect(() => {
    if (currentKiosk && !loading) {
      fetchFeedConfig(currentKiosk.id);
    }
  }, [fetchFeedConfig, currentKiosk, loading]);
}
