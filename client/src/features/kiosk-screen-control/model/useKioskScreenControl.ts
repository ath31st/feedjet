import { useKioskScreenOff, useKioskScreenOn } from '@/entities/kiosk-control';

export const useKioskScreenControl = (kioskId: number, kioskIp: string) => {
  const { mutate: screenOn, isPending: isScreenOnPending } = useKioskScreenOn();
  const { mutate: screenOff, isPending: isScreenOffPending } =
    useKioskScreenOff();

  const handleScreenOn = () => {
    screenOn({ kioskId, kioskIp });
  };

  const handleScreenOff = () => {
    screenOff({ kioskId, kioskIp });
  };

  return {
    handleScreenOn,
    handleScreenOff,
    isScreenOffPending,
    isScreenOnPending,
  };
};
