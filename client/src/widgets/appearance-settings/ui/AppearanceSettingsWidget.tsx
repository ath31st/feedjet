import { ThemeSelector } from '@/features/theme-selector';
import { SettingsCard } from '@/shared/ui/SettingsCard';

interface AppearanceSettingsWidgetProps {
  kioskId: number;
}

export function AppearanceSettingsWidget({
  kioskId,
}: AppearanceSettingsWidgetProps) {
  return (
    <div className="flex w-full flex-row items-start gap-6">
      <div className="flex w-full flex-col gap-6 md:w-2/5">
        <SettingsCard title="Выбор темы">
          <ThemeSelector kioskId={kioskId} />
        </SettingsCard>
      </div>
    </div>
  );
}
