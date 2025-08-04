import { CommonButton } from '@/shared/ui/common/CommonButton';
import { useReloadKioskPageButton } from '../model/useReloadKiosks';
import { ReloadIcon } from '@radix-ui/react-icons';

export function ReloadKioskPageButton() {
  const { handleReload, isPending } = useReloadKioskPageButton();

  return (
    <CommonButton type="button" onClick={handleReload} disabled={isPending}>
      <div className="flex items-center gap-2">
        <ReloadIcon className="h-5 w-5" />
        <span>Перезагрузить</span>
      </div>
    </CommonButton>
  );
}
