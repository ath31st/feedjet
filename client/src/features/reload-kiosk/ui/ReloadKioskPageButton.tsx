import { CommonButton } from '@/shared/ui/common/CommonButton';
import { useReloadKioskPageButton } from '../model/useReloadKiosks';

export function ReloadKioskPageButton() {
  const { handleReload, isPending } = useReloadKioskPageButton();

  return (
    <CommonButton
      type="button"
      text={isPending ? 'Обновляется...' : '🔄 Обновить'}
      onClick={handleReload}
      disabled={isPending}
    />
  );
}
