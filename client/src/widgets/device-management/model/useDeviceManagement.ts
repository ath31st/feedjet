import { useDeleteDevice, useGetAllDevices } from '@/entities/device';
import { useGetScreenStates } from '@/entities/device-control';

export function useDeviceWidget() {
  const refetchInterval = 10_000;
  const { data: devices = [], isLoading } = useGetAllDevices(refetchInterval);
  const { data: screenStates } = useGetScreenStates(30_000);
  const { mutate: deleteDevice } = useDeleteDevice();

  const handleDeleteDevice = (id: string) => {
    deleteDevice({ deviceId: id });
  };

  return {
    devices,
    screenStates,
    isLoading,
    handleDeleteDevice,
  };
}
