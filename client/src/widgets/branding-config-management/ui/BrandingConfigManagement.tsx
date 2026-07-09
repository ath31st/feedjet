import { SettingsCard } from '@/shared/ui';

export function BrandingConfigManagementWidget() {
  return (
    <div className="flex w-full flex-row items-start gap-6">
      <SettingsCard title="Логотип организации" className="w-full md:w-3/5">
        <div>Логотип организации</div>
      </SettingsCard>
      <div className="flex w-full flex-col gap-6 md:w-2/5">
        <SettingsCard title="Настройки наименований">
          <div>Настройки наименований</div>
        </SettingsCard>
      </div>
    </div>
  );
}
