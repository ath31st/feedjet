import { LoadingThreeDotsJumping } from '@/shared/ui';
import { DeviceCard } from './DeviceCard';
import { useDeviceWidget } from '../model/useDeviceManagement';
import type { Device } from '@/entities/device';

export function DeviceList() {
  const {
    devices = [],
    screenStates,
    isLoading,
    handleDeleteDevice,
  } = useDeviceWidget();

  if (isLoading) return <LoadingThreeDotsJumping />;
  if (!devices?.length) return <p>Устройства отсутствуют</p>;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {devices.map((device: Device) => (
        <DeviceCard
          key={device.deviceId}
          device={device}
          screenState={screenStates?.[device.ip]}
          onDelete={handleDeleteDevice}
        />
      ))}
    </div>
  );
}
