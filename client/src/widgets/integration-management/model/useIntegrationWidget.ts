import {
  useCreateIntegration,
  useDeleteIntegration,
  useGetAllIntegrations,
  useUpdateIntegration,
  type Integration,
  type NewIntegration,
  type UpdateIntegration,
} from '@/entities/integration';
import { useGetActiveHeartbeats } from '@/features/kiosk-heartbeat';
import { useState } from 'react';

export function useIntegrationWidget() {
  const [editIntegration, setEditIntegration] = useState<Integration | null>(
    null,
  );
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const { data: heartbeats = [], isLoading: isLoadingHeartbeats } =
    useGetActiveHeartbeats();
  const { data: integrations = [], isLoading: isLoadingIntegrations } =
    useGetAllIntegrations();
  const { mutate: createIntegration } = useCreateIntegration();
  const { mutate: updateIntegration } = useUpdateIntegration();
  const { mutate: deleteIntegration } = useDeleteIntegration();

  const handleCreateIntegration = (integration: NewIntegration) => {
    createIntegration({ data: integration });
  };

  const handleUpdateIntegration = (integration: UpdateIntegration) => {
    updateIntegration({ data: integration });
  };

  const handleDeleteIntegration = (id: number) => {
    deleteIntegration({ integrationId: id });
  };

  return {
    openCreateDialog,
    setOpenCreateDialog,
    heartbeats,
    isLoadingHeartbeats,
    integrations,
    isLoadingIntegrations,
    editIntegration,
    setEditIntegration,
    handleCreateIntegration,
    handleUpdateIntegration,
    handleDeleteIntegration,
  };
}
