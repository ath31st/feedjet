import { useState } from 'react';
import {
  useGetAllKiosks,
  useKioskStore,
  useCreateKiosk,
} from '@/entities/kiosk';
import { CreateKioskDialog } from '@/features/kiosk-create';
import { KioskSelector } from '@/features/kiosk-selector';
import type { NewKiosk } from '@/entities/kiosk';
import { IconButton } from '@/shared/ui/common/IconButton';
import { PlusIcon } from '@radix-ui/react-icons';

export function KioskManagement() {
  const { setCurrentKiosk, currentKiosk } = useKioskStore();
  const { data: kiosks = [] } = useGetAllKiosks();
  const createKioskMutation = useCreateKiosk();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateKiosk = (data: NewKiosk) => {
    createKioskMutation.mutate(data, {
      onSuccess: (newKiosk) => {
        setCurrentKiosk(newKiosk);
        setIsDialogOpen(false);
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <KioskSelector
          kiosks={kiosks}
          activeKiosk={currentKiosk}
          onChange={setCurrentKiosk}
        />
        <IconButton onClick={() => setIsDialogOpen(true)} icon={<PlusIcon />} />
      </div>

      <CreateKioskDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateKiosk}
      />
    </>
  );
}
