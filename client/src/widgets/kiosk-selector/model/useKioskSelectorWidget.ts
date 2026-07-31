import { useGetActiveKiosks, useKioskStore, type Kiosk } from '@/entities/kiosk';
import { useScenarioCopyStore } from '@/entities/scenario';

export function useKioskSelectorWidget() {
  const setCurrentKiosk = useKioskStore((s) => s.setCurrentKiosk);
  const currentKiosk = useKioskStore((s) => s.currentKiosk);
  const isCopyMode = useScenarioCopyStore((s) => s.isCopyMode);
  const onCopyFromKiosk = useScenarioCopyStore((s) => s.onCopyFromKiosk);

  const { data: kiosks = [] } = useGetActiveKiosks();

  const handleChange = (kiosk: Kiosk) => {
    if (isCopyMode && onCopyFromKiosk) {
      onCopyFromKiosk(kiosk.id);
      return;
    }
    setCurrentKiosk(kiosk);
  };

  return {
    kiosks,
    currentKiosk,
    isCopyMode,
    handleChange,
  };
}
