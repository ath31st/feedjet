import { TickerConfigSettings } from '@/features/ticker-config-settings';
import { TickerViewer } from '@/features/ticker-viewer';
import { SettingsCard } from '@/shared/ui/SettingsCard';
import { useTickerManagement } from '../model/useTickerManagement';

export type TickerManagementWidgetProps = {
  kioskId: number;
};

export function TickerManagementWidget({
  kioskId,
}: TickerManagementWidgetProps) {
  const {
    isUpdating,
    isConfigLoading,
    localConfig,
    setLocalConfig,
    handleSave,
    handleReset,
    handleRollbackChanges,
  } = useTickerManagement(kioskId);

  if (!localConfig) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <SettingsCard title="Настройки бегущей строки" className="w-full">
        <div className="flex flex-col items-center gap-6 2xl:flex-row">
          <div className="flex items-center justify-center">
            <div className="relative h-100 w-177.75 overflow-hidden rounded-lg border border-(--border) bg-neutral-900">
              <TickerViewer config={localConfig} showDebugBorder />
            </div>
          </div>

          <TickerConfigSettings
            isConfigLoading={isConfigLoading}
            isUpdating={isUpdating}
            localConfig={localConfig}
            setLocalConfig={setLocalConfig}
            handleSave={handleSave}
            handleReset={handleReset}
            handleRollbackChanges={handleRollbackChanges}
          />
        </div>
      </SettingsCard>
    </div>
  );
}
