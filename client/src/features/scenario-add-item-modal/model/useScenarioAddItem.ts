import { useMediaFolderTree, useMediaInFolder } from '@/entities/media-folder';
import { useAppFeaturesStore } from '@/entities/app-features';
import {
  useAddScenarioItem,
  useAddScenarioItems,
  getWidgetPresentation,
  WIDGET_LABELS,
  type ScenarioWidgetType,
} from '@/entities/scenario';
import { useMemo, useState } from 'react';

export type Tab = 'widget' | 'media';

export type WidgetOption = {
  type: ScenarioWidgetType;
} & ReturnType<typeof getWidgetPresentation>;

export const useScenarioAddItem = (kioskId: number, onClose: () => void) => {
  const [tab, setTab] = useState<Tab>('widget');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const offlineMode = useAppFeaturesStore((s) => s.offlineMode);

  const addItem = useAddScenarioItem(kioskId);
  const addItems = useAddScenarioItems(kioskId);

  const { data: folderTree = [] } = useMediaFolderTree();
  const { data: media = [], isLoading } = useMediaInFolder(selectedFolderId);

  const widgetOptions = useMemo<WidgetOption[]>(
    () =>
      (Object.keys(WIDGET_LABELS) as ScenarioWidgetType[])
        .filter((type) => !(offlineMode && type === 'rss'))
        .map((type) => ({
          type,
          ...getWidgetPresentation(type, offlineMode),
        })),
    [offlineMode],
  );

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
    widgetOptions,
    handleAddWidget,
    handleAddSelected,
  };
};
