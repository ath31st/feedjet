import { useKioskStore } from '..';

export function useCurrentKiosk() {
  const { currentKiosk, loading } = useKioskStore();

  return {
    loading,
    kiosk: currentKiosk,
  };
}
