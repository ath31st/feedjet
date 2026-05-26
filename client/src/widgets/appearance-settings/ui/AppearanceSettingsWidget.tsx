import { ThemeSelector } from '@/features/theme-selector';
import { ScreenRotationSelector } from '@/features/screen-rotation-selector';
import { AnimationModeSelector } from '@/features/animation-mode-selector';
import { SeasonOverlaySelector } from '@/features/season-overlay-selector';
import { SettingsCard } from '@/shared/ui/SettingsCard';

interface AppearanceSettingsWidgetProps {
  kioskId: number;
}

export function AppearanceSettingsWidget({
  kioskId,
}: AppearanceSettingsWidgetProps) {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-6 xl:grid-cols-2">
      <div className="flex flex-col gap-6">
        <SettingsCard title="Анимация">
          <AnimationModeSelector kioskId={kioskId} />
        </SettingsCard>

        <SettingsCard title="Выбор темы">
          <ThemeSelector kioskId={kioskId} />
        </SettingsCard>
      </div>

      <div className="flex flex-col gap-6">
        <SettingsCard title="Поворот экрана">
          <ScreenRotationSelector kioskId={kioskId} />
        </SettingsCard>

        <SettingsCard title="Сезонный эффект">
          <SeasonOverlaySelector kioskId={kioskId} />
        </SettingsCard>
      </div>
    </div>
  );
}
