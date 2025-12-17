import { CommonButton } from '@/shared/ui/common';
import { MoonIcon } from '@radix-ui/react-icons';
import { useKioskScreenControl } from '../model/useKioskScreenControl';

interface KioskScreenOffActionProps {
  kioskIp: string;
}

export function KioskScreenOffAction({ kioskIp }: KioskScreenOffActionProps) {
  const { handleScreenOff, isScreenOffPending } =
    useKioskScreenControl(kioskIp);

  return (
    <CommonButton
      type="button"
      onClick={handleScreenOff}
      disabled={isScreenOffPending}
      tooltip="Выключить экран киоска"
    >
      <MoonIcon />
    </CommonButton>
  );
}
