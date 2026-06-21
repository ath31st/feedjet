import {
  useDeviceScreenOff,
  useDeviceScreenOn,
} from '@/entities/device-control';

export const useDeviceScreenControl = (ip: string) => {
  const { mutate: screenOn, isPending: isScreenOnPending } =
    useDeviceScreenOn();
  const { mutate: screenOff, isPending: isScreenOffPending } =
    useDeviceScreenOff();

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
