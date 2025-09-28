import { useKioskStore } from '@/entities/kiosk';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const useKioskInitialization = () => {
  const { slug = 'default' } = useParams();
  const fetchKioskBySlug = useKioskStore((s) => s.fetchKioskBySlug);

  useEffect(() => {
    if (slug) {
      fetchKioskBySlug(slug);
    }
  }, [slug, fetchKioskBySlug]);
};
