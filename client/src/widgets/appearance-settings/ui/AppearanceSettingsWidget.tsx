import { ThemeSelector } from '@/features/theme-selector';
import { WidgetSelector } from '@/features/widget-selector';
import { WidgetRotationInterval } from '@/features/widget-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';

interface AppearanceSettingsWidgetProps {
  kioskId: number;
}

export function AppearanceSettingsWidget({
  kioskId,
}: AppearanceSettingsWidgetProps) {
  return (
    <div className="flex w-full flex-row items-start gap-6">
      <SettingsCard title="Выбор виджетов" className="w-full md:w-3/5">
        <WidgetSelector kioskId={kioskId} />
      </SettingsCard>
      <div className="flex w-full flex-col gap-6 md:w-2/5">
        <SettingsCard title="Интервал смены виджетов">
          <WidgetRotationInterval kioskId={kioskId} />
        </SettingsCard>

        <SettingsCard title="Настройки оформления">
          <ThemeSelector kioskId={kioskId} />
        </SettingsCard>
      </div>
    </div>
  );
}
