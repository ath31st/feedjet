import { useKioskScreenOff, useKioskScreenOn } from '@/entities/kiosk-control';

export const useKioskScreenControl = (kioskIp: string) => {
  const { mutate: screenOn, isPending: isScreenOnPending } = useKioskScreenOn();
  const { mutate: screenOff, isPending: isScreenOffPending } =
    useKioskScreenOff();

  const handleScreenOn = () => {
    const password = window.prompt('Пароль Fully Kiosk');
    if (!password) return;

    screenOn({ kioskIp, password });
  };

  const handleScreenOff = () => {
    const password = window.prompt('Пароль Fully Kiosk');
    if (!password) return;

    screenOff({ kioskIp, password });
  };

  return {
    handleScreenOn,
    handleScreenOff,
    isScreenOffPending,
    isScreenOnPending,
  };
};
