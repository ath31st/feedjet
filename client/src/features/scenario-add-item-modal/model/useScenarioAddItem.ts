import { useMediaFolderTree, useMediaInFolder } from '@/entities/media-folder';
import {
  useAddScenarioItem,
  useAddScenarioItems,
  type ScenarioWidgetType,
} from '@/entities/scenario';
import { useState } from 'react';

export type Tab = 'widget' | 'media';

export const useScenarioAddItem = (kioskId: number, onClose: () => void) => {
  const [tab, setTab] = useState<Tab>('widget');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const addItem = useAddScenarioItem(kioskId);
  const addItems = useAddScenarioItems(kioskId);

  const { data: folderTree = [] } = useMediaFolderTree();
  const { data: media = [], isLoading } = useMediaInFolder(selectedFolderId);

  const handleAddWidget = (widgetType: ScenarioWidgetType) => {
    addItem.mutate(
      {
        kioskId,
        item: {
          type: 'widget',
          widgetType,
          order: 0,
          isActive: true,
          durationSeconds: 15,
        },
      },
      { onSuccess: onClose },
    );
  };

  const handleAddSelected = () => {
    const items = Array.from(selectedFiles).map((key) => {
      const [kind, id] = key.split('-');

      if (kind === 'image') {
        return {
          type: 'image' as const,
          imageId: Number(id),
          order: 0,
          isActive: true,
          durationSeconds: 10,
        };
      }

      return {
        type: 'video' as const,
        videoId: Number(id),
        order: 0,
        isActive: true,
      };
    });

    addItems.mutate(
      { kioskId, items },
      {
        onSuccess: () => {
          setSelectedFiles(new Set());
          onClose();
        },
      },
    );
  };
  return {
    tab,
    setTab,
    selectedFolderId,
    setSelectedFolderId,
    selectedFiles,
    setSelectedFiles,
    folderTree,
    media,
    isLoading,
    handleAddWidget,
    handleAddSelected,
  };
};
