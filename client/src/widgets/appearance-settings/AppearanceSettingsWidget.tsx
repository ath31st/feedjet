import { ThemeSelector } from '@/features/theme-selector';
import { WidgetSelector } from '@/features/widget-selector';
import { WidgetRotationInterval } from '@/features/widget-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';

export function AppearanceSettingsWidget() {
  return (
    <SettingsCard title="Настройки оформления" className="w-full md:w-1/2">
      <div className="flex flex-col gap-4">
        <ThemeSelector />
        <WidgetSelector />
        <WidgetRotationInterval />
      </div>
    </SettingsCard>
  );
}
