import { SettingsCard } from '@/shared/ui';
import { DeviceList } from './DeviceList';

export function DeviceManagement() {
  return (
    <div className="flex flex-col gap-6">
      <SettingsCard title="Список устройств" className="w-full">
        <DeviceList />
      </SettingsCard>
    </div>
  );
}
