import { useState } from 'react';
import { useCreateKiosk } from '@/entities/kiosk';
import { CreateKioskDialog } from '@/features/kiosk-create';
import type { NewKiosk } from '@/entities/kiosk';
import { IconButton } from '@/shared/ui/common/IconButton';
import { PlusIcon } from '@radix-ui/react-icons';
import { SettingsCard } from '@/shared/ui/SettingsCard';
import { KioskList } from './KioskList';

export function KioskManagement() {
  const createKioskMutation = useCreateKiosk();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateKiosk = (data: NewKiosk) => {
    createKioskMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

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
