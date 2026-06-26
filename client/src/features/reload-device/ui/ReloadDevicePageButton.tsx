import { CommonButton } from '@/shared/ui/common';
import { useReloadDevicePageButton } from '../model/useReloadDevice';
import { ReloadIcon } from '@radix-ui/react-icons';

interface ReloadDevicePageButtonProps {
  deviceId: string;
}

export function ReloadDevicePageButton({
  deviceId,
}: ReloadDevicePageButtonProps) {
  const { handleReload, isPending } = useReloadDevicePageButton(deviceId);

  return (
    <CommonButton
      type="button"
      onClick={handleReload}
      disabled={isPending}
      tooltip="Перезагрузить устройство"
    >
      <ReloadIcon />
    </CommonButton>
  );
}
