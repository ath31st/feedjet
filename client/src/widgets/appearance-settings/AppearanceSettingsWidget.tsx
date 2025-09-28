import { ThemeSelector } from '@/features/theme-selector';
import { WidgetSelector } from '@/features/widget-selector';
import { WidgetRotationInterval } from '@/features/widget-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';
import { useCurrentKiosk } from '@/entities/kiosk';
import { StatusMessageCard } from '@/shared/ui/StatusMessageCard';

export function AppearanceSettingsWidget() {
  const { kiosk, loading } = useCurrentKiosk();

  if (loading) {
    return (
      <StatusMessageCard
        title="Настройки оформления"
        message="Загрузка киоска..."
        className="w-full md:w-1/2"
      />
    );
  }

  if (!kiosk) {
    return (
      <StatusMessageCard
        title="Настройки оформления"
        message="Киоск не выбран"
        className="w-full md:w-1/2"
      />
    );
  }

  const { id: kioskId } = kiosk;

  return (
    <SettingsCard title="Настройки оформления" className="w-full md:w-1/2">
      <div className="flex flex-col gap-4">
        <ThemeSelector kioskId={kioskId} />
        <WidgetSelector kioskId={kioskId} />
        <WidgetRotationInterval kioskId={kioskId} />
      </div>
    </SettingsCard>
  );
}
