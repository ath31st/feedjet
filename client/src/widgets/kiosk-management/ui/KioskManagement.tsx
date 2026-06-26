import { CreateKioskDialog } from '@/features/kiosk-create';
import { SettingsCard } from '@/shared/ui/SettingsCard';
import { KioskList } from './KioskList';
import { useKioskManagement } from '../model/useKioskManagement';
import { CommonButton } from '@/shared/ui/common';
import { PlusIcon } from 'lucide-react';

export function KioskManagement() {
  const {
    isDialogOpen,
    setIsDialogOpen,
    handleCreateKiosk,
    kiosksLength,
    kioskLimit,
    isLimitReached,
  } = useKioskManagement();

  return (
    <SettingsCard title="Конфигурации киосков" className="w-full">
      <div className="flex w-full flex-col gap-6">
        <div className="flex justify-end text-xs">
          <CommonButton
            type="button"
            onClick={() => !isLimitReached && setIsDialogOpen(true)}
            disabled={isLimitReached}
            tooltip={
              isLimitReached ? `Достигнут лимит (${kioskLimit})` : undefined
            }
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <PlusIcon size={14} />
              {`Добавить конфигурацию (${kiosksLength}/${kioskLimit})`}
            </div>
          </CommonButton>
        </div>

        <KioskList />
      </div>

      <CreateKioskDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateKiosk}
      />
    </SettingsCard>
  );
}
