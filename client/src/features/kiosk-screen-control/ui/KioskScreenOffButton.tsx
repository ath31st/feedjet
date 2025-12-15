import { CommonButton } from '@/shared/ui/common';
import { MoonIcon } from '@radix-ui/react-icons';
import { useKioskScreenControl } from '../model/useKioskScreenControl';

interface KioskScreenOffButtonProps {
  kioskIp: string;
}

export function KioskScreenOffButton({ kioskIp }: KioskScreenOffButtonProps) {
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
