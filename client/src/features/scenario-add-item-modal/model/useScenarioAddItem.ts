import {
  getChildFolders,
  toggleMediaSelectionKey,
  useMediaFolderTree,
  useMediaInFolder,
} from '@/entities/media-folder';
import { useAppFeaturesStore } from '@/entities/app-features';
import {
  getWidgetPresentation,
  nextTempScenarioItemId,
  WIDGET_LABELS,
  type ScenarioItem,
  type ScenarioWidgetType,
} from '@/entities/scenario';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export type Tab = 'widget' | 'media';

export type WidgetOption = {
  type: ScenarioWidgetType;
} & ReturnType<typeof getWidgetPresentation>;

export const useScenarioAddItem = (
  onAddItems: (items: ScenarioItem[]) => void,
  onClose: () => void,
) => {
  const [tab, setTab] = useState<Tab>('widget');
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const offlineMode = useAppFeaturesStore((s) => s.offlineMode);

  const { data: folderTree = [] } = useMediaFolderTree();
  const { data: allMedia = [], isLoading } = useMediaInFolder(selectedFolderId);
  const media = useMemo(
    () => allMedia.filter((file) => file.kind !== 'pdf'),
    [allMedia],
  );

  const childFolders = useMemo(
    () => getChildFolders(folderTree, selectedFolderId),
    [folderTree, selectedFolderId],
  );

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

  const handleTabChange = (nextTab: Tab) => {
    setTab(nextTab);
    setSelectedFiles(new Set());
  };

  const handleSelectFolder = (id: number | null) => {
    setSelectedFolderId(id);
  };

  const handleToggleSelect = (key: string) => {
    setSelectedFiles((prev) => toggleMediaSelectionKey(prev, key));
  };

  const handleClearSelection = () => {
    setSelectedFiles(new Set());
  };

  const handleAddWidget = (widgetType: ScenarioWidgetType) => {
    onAddItems([
      {
        id: nextTempScenarioItemId(),
        scenarioId: 0,
        type: 'widget',
        widgetType,
        imageId: null,
        videoId: null,
        order: 0,
        isActive: true,
        durationSeconds: 15,
      },
    ]);
    toast.success('Элемент добавлен в черновик');
    onClose();
  };

  const handleAddSelected = () => {
    const items: ScenarioItem[] = [];

    for (const key of selectedFiles) {
      const [kind, idStr] = key.split('-');
      const mediaId = Number(idStr);
      const file = media.find((m) => m.kind === kind && m.id === mediaId);

      if (!file) continue;

      if (file.kind === 'image') {
        items.push({
          id: nextTempScenarioItemId(),
          scenarioId: 0,
          type: 'image',
          widgetType: null,
          imageId: file.id,
          videoId: null,
          order: 0,
          isActive: true,
          durationSeconds: 10,
          imageName: file.name,
          imageFileName: file.fileName,
          imageThumbnail: file.thumbnail,
          imageWidth: file.width,
          imageHeight: file.height,
        });
      } else if (file.kind === 'video') {
        items.push({
          id: nextTempScenarioItemId(),
          scenarioId: 0,
          type: 'video',
          widgetType: null,
          imageId: null,
          videoId: file.id,
          order: 0,
          isActive: true,
          durationSeconds: null,
          videoName: file.name,
          videoFileName: file.fileName,
          videoThumbnail: file.thumbnail,
          videoDuration: file.duration,
        });
      }
    }

    if (items.length === 0) return;

    onAddItems(items);
    setSelectedFiles(new Set());
    toast.success(
      items.length === 1
        ? 'Элемент добавлен в черновик'
        : 'Элементы добавлены в черновик',
    );
    onClose();
  };

  return {
    tab,
    handleTabChange,
    selectedFolderId,
    handleSelectFolder,
    selectedFiles,
    handleToggleSelect,
    handleClearSelection,
    folderTree,
    media,
    childFolders,
    isLoading,
    widgetOptions,
    handleAddWidget,
    handleAddSelected,
  };
};
