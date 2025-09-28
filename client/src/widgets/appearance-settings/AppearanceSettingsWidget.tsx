import { ThemeSelector } from '@/features/theme-selector';
import { WidgetSelector } from '@/features/widget-selector';
import { WidgetRotationInterval } from '@/features/widget-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';

type AppearanceSettingsWidgetProps = {
  kioskId: number;
};

export function AppearanceSettingsWidget({
  kioskId,
}: AppearanceSettingsWidgetProps) {
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
