import { useDeleteDevice, useGetAllDevices } from '@/entities/device';

export function useDeviceWidget() {
  const refetchInterval = 10_000;
  const { data: devices = [], isLoading } = useGetAllDevices(refetchInterval);
  const { mutate: deleteDevice } = useDeleteDevice();

  const handleDeleteDevice = (id: string) => {
    deleteDevice({ deviceId: id });
  };

  return {
    devices,
    isLoading,
    handleDeleteDevice,
  };
}
