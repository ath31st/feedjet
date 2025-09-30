import { CreateKioskDialog } from '@/features/kiosk-create';
import { IconButton } from '@/shared/ui/common/IconButton';
import { PlusIcon } from '@radix-ui/react-icons';
import { SettingsCard } from '@/shared/ui/SettingsCard';
import { KioskList } from './KioskList';
import { useKioskManagement } from '../model/useKioskManagement';

export function KioskManagement() {
  const { isDialogOpen, setIsDialogOpen, handleCreateKiosk } =
    useKioskManagement();

  return (
    <SettingsCard title="Управление киосками" className="mt-6 w-full">
      <KioskList />

      <IconButton onClick={() => setIsDialogOpen(true)} icon={<PlusIcon />} />

      <CreateKioskDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateKiosk}
      />
    </SettingsCard>
  );
}
