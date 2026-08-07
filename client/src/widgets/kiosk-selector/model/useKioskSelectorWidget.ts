import {
  useGetActiveKiosks,
  useKioskStore,
  type Kiosk,
} from '@/entities/kiosk';
import { useScenarioCopyStore } from '@/entities/scenario';
import { useUnsavedChangesStore } from '@/shared/model';

export function useKioskSelectorWidget() {
  const setCurrentKiosk = useKioskStore((s) => s.setCurrentKiosk);
  const currentKiosk = useKioskStore((s) => s.currentKiosk);
  const isCopyMode = useScenarioCopyStore((s) => s.isCopyMode);
  const onCopyFromKiosk = useScenarioCopyStore((s) => s.onCopyFromKiosk);
  const requestLeave = useUnsavedChangesStore((s) => s.requestLeave);

  const { data: kiosks = [] } = useGetActiveKiosks();

  const handleChange = (kiosk: Kiosk) => {
    if (isCopyMode && onCopyFromKiosk) {
      onCopyFromKiosk(kiosk.id);
      return;
    }
    if (currentKiosk?.id === kiosk.id) return;
    requestLeave(() => setCurrentKiosk(kiosk));
  };

  return {
    kiosks,
    currentKiosk,
    isCopyMode,
    handleChange,
  };
}
