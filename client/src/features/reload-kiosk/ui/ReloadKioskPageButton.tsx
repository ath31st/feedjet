import { CommonButton } from '@/shared/ui/common/CommonButton';
import { useReloadKiosks } from '../model/useReloadKiosks';

export function ReloadKioskPageButton() {
  const reload = useReloadKiosks();
  const handleReload = () => {
    reload.mutate();
  };
  return (
    <CommonButton type="button" text="🔄 Обновить" onClick={handleReload} />
  );
}
