import { CommonButton } from '@/shared/ui/common';
import { SunIcon } from '@radix-ui/react-icons';
import { useDeviceScreenControl } from '../model/useDeviceScreenControl';

interface DeviceScreenOnActionProps {
  ip: string;
}

export function DeviceScreenOnAction({ ip }: DeviceScreenOnActionProps) {
  const { handleScreenOn, isScreenOnPending } = useDeviceScreenControl(ip);

  return (
    <CommonButton
      type="button"
      onClick={handleScreenOn}
      disabled={isScreenOnPending}
      tooltip="Включить экран устройства"
    >
      <SunIcon />
    </CommonButton>
  );
}
