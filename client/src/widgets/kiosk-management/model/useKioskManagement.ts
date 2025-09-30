import { useCreateKiosk, type NewKiosk } from '@/entities/kiosk';
import { useState } from 'react';

export function useKioskManagement() {
  const createKioskMutation = useCreateKiosk();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateKiosk = (data: NewKiosk) => {
    createKioskMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    handleCreateKiosk,
  };
}
