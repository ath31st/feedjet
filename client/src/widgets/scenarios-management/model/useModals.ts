import { useState, useCallback } from 'react';
import type { PreviewMediaState } from '@/features/scenario-editor';

export function useModals() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [previewContent, setPreviewContent] =
    useState<PreviewMediaState | null>(null);

  const openAddModal = useCallback(() => setAddModalOpen(true), []);
  const closeAddModal = useCallback(() => setAddModalOpen(false), []);

  const openPreview = useCallback((payload: PreviewMediaState) => {
    setPreviewContent(payload);
  }, []);
  const closePreview = useCallback(() => setPreviewContent(null), []);

  return {
    addModalOpen,
    openAddModal,
    closeAddModal,
    previewContent,
    openPreview,
    closePreview,
  };
}
