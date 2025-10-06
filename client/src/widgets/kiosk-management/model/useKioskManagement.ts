import {
  useCreateKiosk,
  useGetAllKiosks,
  type NewKiosk,
} from '@/entities/kiosk';
import { useState } from 'react';

export function useKioskManagement() {
  const kioskLimit = 8;
  const createKioskMutation = useCreateKiosk();
  const { data: kiosks = [] } = useGetAllKiosks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isLimitReached = kiosks.length >= kioskLimit;

  const handleCreateKiosk = (data: NewKiosk) => {
    createKioskMutation.mutate(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  return {
    isLimitReached,
    kioskLimit,
    kiosksLength: kiosks.length,
    isDialogOpen,
    setIsDialogOpen,
    handleCreateKiosk,
  };
}
