import { useGetAllKiosks, useKioskStore } from '@/entities/kiosk';
import { KioskSelector } from '@/features/kiosk-selector';

export function KioskManagement() {
  const { setCurrentKiosk, currentKiosk } = useKioskStore();
  const { data: kiosks = [] } = useGetAllKiosks();

  return (
    <KioskSelector
      kiosks={kiosks}
      activeKiosk={currentKiosk}
      onChange={setCurrentKiosk}
    />
  );
}
