import { useGetActiveKiosks, useKioskStore } from '@/entities/kiosk';
import { KioskSelector } from '@/features/kiosk-selector';

export function KioskSelectorWidget() {
  const { setCurrentKiosk, currentKiosk } = useKioskStore();
  const { data: kiosks = [] } = useGetActiveKiosks();

  return (
    <KioskSelector
      kiosks={kiosks}
      activeKiosk={currentKiosk}
      onChange={setCurrentKiosk}
    />
  );
}
