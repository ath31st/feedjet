import { ThemeSelector } from '@/features/theme-selector';
import { WidgetSelector } from '@/features/widget-selector';
import { WidgetRotationInterval } from '@/features/widget-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';

export function AppearanceSettingsWidget() {
  return (
    <SettingsCard title="Настройки оформления" className="w-full md:w-1/2">
      <div className="flex flex-col">
        <label htmlFor="theme" className="mb-2 block">
          Тема:
        </label>
        <ThemeSelector />

        <label htmlFor="widget" className="mb-2 block">
          Виджеты в ротации:
        </label>
        <WidgetSelector />

        <label htmlFor="rotation-interval" className="mb-2 block">
          Интервал смены виджетов (в секундах):
        </label>
        <WidgetRotationInterval />
      </div>
    </SettingsCard>
  );
}
