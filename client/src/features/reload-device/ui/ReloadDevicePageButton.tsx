import { CommonButton } from '@/shared/ui/common';
import { useReloadDevicePageButton } from '../model/useReloadDevice';
import { ReloadIcon } from '@radix-ui/react-icons';

interface ReloadDevicePageButtonProps {
  ip: string;
}

export function ReloadDevicePageButton({ ip }: ReloadDevicePageButtonProps) {
  const { handleReload, isPending } = useReloadDevicePageButton(ip);

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
