import { CommonButton } from '@/shared/ui/common';
import { MoonIcon } from '@radix-ui/react-icons';
import { useKioskScreenControl } from '../model/useKioskScreenControl';

interface KioskScreenOffActionProps {
  kioskId: number;
  kioskIp: string;
}

export function KioskScreenOffAction({
  kioskId,
  kioskIp,
}: KioskScreenOffActionProps) {
  const { handleScreenOff, isScreenOffPending } = useKioskScreenControl(
    kioskId,
    kioskIp,
  );

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
