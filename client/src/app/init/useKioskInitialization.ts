import { useKioskStore } from '@/entities/kiosk';
import { useKioskParams } from '@/features/kiosk-params';
import { useEffect } from 'react';

export const useKioskInitialization = () => {
  const { slug } = useKioskParams();
  const fetchKioskBySlug = useKioskStore((s) => s.fetchKioskBySlug);

  useEffect(() => {
    if (slug) {
      fetchKioskBySlug(slug);
    }
  }, [slug, fetchKioskBySlug]);
};
