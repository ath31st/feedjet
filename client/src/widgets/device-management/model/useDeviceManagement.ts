import { useDeleteDevice, useGetAllDevices } from '@/entities/device';

export function useDeviceWidget() {
  const { data: devices = [], isLoading } = useGetAllDevices();
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
