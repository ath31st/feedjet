import { LogViewer } from '@/features/log-viewer';
import { SettingsCard } from '@/shared/ui';

export const LogWidget = () => {
  return (
    <SettingsCard title="Журнал событий" className="w-full">
      <LogViewer />
    </SettingsCard>
  );
};
