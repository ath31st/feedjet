import { SettingsCard } from '@/shared/ui';
import { BrandingForm } from './BrandingForm';

export function BrandingConfigManagementWidget() {
  return (
    <div className="flex w-full flex-row items-start gap-6">
      <SettingsCard title="Логотип организации" className="w-full md:w-3/5">
        <div>Здесь будет загрузка логотипа.</div>
      </SettingsCard>

      <div className="flex w-full flex-col gap-6 md:w-2/5">
        <SettingsCard title="Настройки наименований">
          <BrandingForm />
        </SettingsCard>
      </div>
    </div>
  );
}
