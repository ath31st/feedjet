import { KioskSelector } from '@/features/kiosk-selector';
import { useKioskSelectorWidget } from '../model/useKioskSelectorWidget';

export function KioskSelectorWidget() {
  const { kiosks, currentKiosk, isCopyMode, handleChange } =
    useKioskSelectorWidget();

  return (
    <KioskSelector
      kiosks={kiosks}
      activeKiosk={currentKiosk}
      onChange={handleChange}
      copyMode={isCopyMode}
    />
  );
}
