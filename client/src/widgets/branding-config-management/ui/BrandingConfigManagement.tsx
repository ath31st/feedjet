import { SettingsCard } from '@/shared/ui';
import { BrandingForm } from './BrandingForm';
import { LogoUploader } from './LogoUploader';

export function BrandingConfigManagementWidget() {
  return (
    <div className="flex w-full flex-row items-start gap-6">
      <SettingsCard
        title="Логотип организации"
        className="flex w-full items-center justify-center md:w-3/5"
      >
        <LogoUploader />
      </SettingsCard>

      <div className="flex w-full flex-col gap-6 md:w-2/5">
        <SettingsCard title="Настройки наименований">
          <BrandingForm />
        </SettingsCard>
      </div>
    </div>
  );
}
