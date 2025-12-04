import { CreateKioskDialog } from '@/features/kiosk-create';
import { SettingsCard } from '@/shared/ui/SettingsCard';
import { KioskList } from './KioskList';
import { useKioskManagement } from '../model/useKioskManagement';

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
        <KioskList />

        <button
          type="button"
          onClick={() => !isLimitReached && setIsDialogOpen(true)}
          disabled={isLimitReached}
          className={`flex w-1/5 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm ${
            isLimitReached
              ? 'cursor-not-allowed bg-[var(--border)] text-[var(--button-text)]'
              : 'cursor-pointer bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)]'
          }`}
        >
          Добавить киоск ({kiosksLength}/{kioskLimit})
        </button>
      </div>

      <CreateKioskDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateKiosk}
      />
    </SettingsCard>
  );
}
