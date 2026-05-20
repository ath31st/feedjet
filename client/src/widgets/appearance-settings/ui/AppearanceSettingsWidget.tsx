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
    <div className="flex w-full flex-row items-start gap-6">
      <div className="flex w-full flex-col gap-6 md:w-1/2">
        <SettingsCard title="Анимация">
          <AnimationModeSelector kioskId={kioskId} />
        </SettingsCard>
        <SettingsCard title="Выбор темы">
          <ThemeSelector kioskId={kioskId} />
        </SettingsCard>
      </div>

      <div className="flex w-full flex-col gap-6 md:w-1/2">
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
