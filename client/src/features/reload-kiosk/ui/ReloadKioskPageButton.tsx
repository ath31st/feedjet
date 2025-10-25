import { CommonButton } from '@/shared/ui/common';
import { useReloadKioskPageButton } from '../model/useReloadKiosks';
import { ReloadIcon } from '@radix-ui/react-icons';

interface ReloadKioskPageButtonProps {
  kioskId: number;
}

export function ReloadKioskPageButton({ kioskId }: ReloadKioskPageButtonProps) {
  const { handleReload, isPending } = useReloadKioskPageButton(kioskId);

  return (
    <CommonButton
      type="button"
      onClick={handleReload}
      disabled={isPending}
      tooltip="Перезагрузить киоск"
    >
      <ReloadIcon />
    </CommonButton>
  );
}
