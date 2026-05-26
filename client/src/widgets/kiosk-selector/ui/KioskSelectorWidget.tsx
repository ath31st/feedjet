import { useGetActiveKiosks, useKioskStore } from '@/entities/kiosk';
import { KioskSelector } from '@/features/kiosk-selector';

export function KioskSelectorWidget() {
  const setCurrentKiosk = useKioskStore((s) => s.setCurrentKiosk);
  const currentKiosk = useKioskStore((s) => s.currentKiosk);

  const { data: kiosks = [] } = useGetActiveKiosks();

  return (
    <KioskSelector
      kiosks={kiosks}
      activeKiosk={currentKiosk}
      onChange={setCurrentKiosk}
    />
  );
}
