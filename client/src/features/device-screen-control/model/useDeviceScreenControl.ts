import { useKioskScreenOff, useKioskScreenOn } from '@/entities/kiosk-control';

export const useDeviceScreenControl = (ip: string) => {
  const { mutate: screenOn, isPending: isScreenOnPending } = useKioskScreenOn();
  const { mutate: screenOff, isPending: isScreenOffPending } =
    useKioskScreenOff();

  const handleScreenOn = () => {
    screenOn({ ip });
  };

  const handleScreenOff = () => {
    screenOff({ ip });
  };

  return {
    handleScreenOn,
    handleScreenOff,
    isScreenOffPending,
    isScreenOnPending,
  };
};
