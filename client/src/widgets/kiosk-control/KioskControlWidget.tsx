import { ReloadKioskPageButton } from '@/features/reload-kiosk';
import { SettingsCard } from '@/shared/ui/SettingsCard';

export function KioskControlWidget() {
  return (
    <SettingsCard
      title="Обновление страницы киоска"
      className="w-full md:w-1/2"
    >
      <ReloadKioskPageButton />
    </SettingsCard>
  );
}
