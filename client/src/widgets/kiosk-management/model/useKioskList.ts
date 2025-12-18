import {
  useCreateIntegration,
  useDeleteIntegration,
  useGetAllIntegrations,
  useUpdateIntegration,
  type Integration,
  type IntegrationType,
  type NewIntegration,
  type UpdateIntegration,
} from '@/entities/integration';
import {
  useDeleteKiosk,
  useGetAllKiosks,
  useKioskStore,
  useUpdateKiosk,
  type Kiosk,
  type UpdateKiosk,
} from '@/entities/kiosk';
import { useGetActiveHeartbeats } from '@/features/kiosk-heartbeat';
import { useState } from 'react';

export function useKioskList() {
  const [editKiosk, setEditKiosk] = useState<Kiosk | null>(null);
  const [editIntegration, setEditIntegration] = useState<Integration | null>(
    null,
  );
  const [createIntegrationFor, setCreateIntegrationFor] =
    useState<Kiosk | null>(null);
  const { currentKiosk, setDefaultKiosk } = useKioskStore();
  const { data: kiosks, isLoading } = useGetAllKiosks();
  const { data: heartbeats = [] } = useGetActiveHeartbeats();
  const { data: integrations = [] } = useGetAllIntegrations();
  const createIntegration = useCreateIntegration();
  const updateIntegration = useUpdateIntegration();
  const deleteIntegration = useDeleteIntegration();
  const deleteKiosk = useDeleteKiosk();
  const updateKiosk = useUpdateKiosk();

  const kiosksWithHeartbeats = kiosks?.map((kiosk) => ({
    ...kiosk,
    heartbeats: heartbeats.filter((h) => h.slug === kiosk.slug),
  }));

  const kiosksWithIntegrations = kiosksWithHeartbeats?.map((kiosk) => ({
    ...kiosk,
    integration: integrations.find((i) => i.kioskId === kiosk.id) ?? null,
  }));

  const handleDelete = (id: number) => {
    deleteKiosk.mutate(
      { kioskId: id },
      {
        onSuccess: () => {
          if (currentKiosk?.id === id) {
            setDefaultKiosk();
          }
        },
      },
    );
  };

  const handleUpdate = (kioskId: number, kiosk: UpdateKiosk) => {
    updateKiosk.mutate({
      kioskId,
      data: kiosk,
    });
  };

  const handleDeleteIntegration = (type: IntegrationType, kioskId: number) => {
    deleteIntegration.mutate({ type, kioskId });
  };

  const handleCreateIntegration = (
    kioskId: number,
    integration: NewIntegration,
  ) => {
    createIntegration.mutate({
      kioskId,
      data: integration,
    });
  };

  const handleUpdateIntegration = (
    kioskId: number,
    integration: UpdateIntegration,
  ) => {
    updateIntegration.mutate({
      kioskId,
      update: integration,
    });
  };

  return {
    editKiosk,
    setEditKiosk,
    createIntegrationFor,
    setCreateIntegrationFor,
    editIntegration,
    setEditIntegration,
    kiosks: kiosksWithIntegrations,
    isLoading,
    handleDelete,
    handleUpdate,
    handleDeleteIntegration,
    handleCreateIntegration,
    handleUpdateIntegration,
  };
}
