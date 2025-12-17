import { CommonButton } from '@/shared/ui/common';
import { SunIcon } from '@radix-ui/react-icons';
import { useKioskScreenControl } from '../model/useKioskScreenControl';

interface KioskScreenOnActionProps {
  kioskIp: string;
}

export function KioskScreenOnAction({ kioskIp }: KioskScreenOnActionProps) {
  const { handleScreenOn, isScreenOnPending } = useKioskScreenControl(kioskIp);

  return (
    <CommonButton
      type="button"
      onClick={handleScreenOn}
      disabled={isScreenOnPending}
      tooltip="Включить экран киоска"
    >
      <SunIcon />
    </CommonButton>
  );
}
