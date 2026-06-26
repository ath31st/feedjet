import { CommonButton } from '@/shared/ui/common';
import { MoonIcon } from '@radix-ui/react-icons';
import { useDeviceScreenControl } from '../model/useDeviceScreenControl';

interface DeviceScreenOffActionProps {
  ip: string;
}

export function DeviceScreenOffAction({ ip }: DeviceScreenOffActionProps) {
  const { handleScreenOff, isScreenOffPending } = useDeviceScreenControl(ip);

  return (
    <CommonButton
      type="button"
      onClick={handleScreenOff}
      disabled={isScreenOffPending}
      tooltip="Выключить экран устройства"
    >
      <MoonIcon />
    </CommonButton>
  );
}
