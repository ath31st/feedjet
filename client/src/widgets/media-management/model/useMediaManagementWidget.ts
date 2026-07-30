import { useDeleteImageGlobal } from '@/entities/image';
import {
  getChildFolders,
  mediaFileKey,
  splitSelectionKeys,
  toggleMediaSelectionKey,
  useDeleteMediaBatch,
  useMediaFolderTree,
  useMediaInFolder,
  useMoveMediaBatch,
  type MediaFile,
} from '@/entities/media-folder';
import { useDeleteVideoGlobal } from '@/entities/video';
import { useEffect, useMemo, useState } from 'react';

export function useMediaManagementWidget() {
  const { mutate: deleteImageMut } = useDeleteImageGlobal();
  const { mutate: deleteVideoMut } = useDeleteVideoGlobal();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(
    () => new Set(),
  );
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [moveMode, setMoveMode] = useState(false);
  const { mutate: moveMediaBatch, isPending: isMoving } = useMoveMediaBatch();
  const { mutate: deleteMediaBatch } = useDeleteMediaBatch();
  const selectionCounts = useMemo(
    () => splitSelectionKeys(selectedFiles),
    [selectedFiles],
  );
  const { data: folderTree = [] } = useMediaFolderTree();
  const { data: media = [], isLoading } = useMediaInFolder(selectedFolderId);

  const childFolders = useMemo(
    () => getChildFolders(folderTree, selectedFolderId),
    [folderTree, selectedFolderId],
  );

  const selectionTotal =
    selectionCounts.imageIds.length + selectionCounts.videoIds.length;

  useEffect(() => {
    setSelectedFiles((prev) => {
      if (prev.size === 0) return prev;

      const valid = new Set(media.map(mediaFileKey));
      const next = new Set([...prev].filter((key) => valid.has(key)));

      return next.size === prev.size ? prev : next;
    });
  }, [media]);

  const handleSelectFolder = (id: number | null) => {
    setSelectedFolderId(id);
  };

  const handleToggleSelect = (key: string) => {
    setSelectedFiles((prev) => toggleMediaSelectionKey(prev, key));
  };

  const handleClearSelection = () => {
    setSelectedFiles(new Set());
  };

  const handleOpenPreview = (file: MediaFile) => {
    setPreview(file);
  };

  const handleClosePreview = () => {
    setPreview(null);
  };

  const handleBulkDelete = () => {
    if (selectionTotal === 0) return;

    deleteMediaBatch(
      {
        imageIds: selectionCounts.imageIds,
        videoIds: selectionCounts.videoIds,
      },
      {
        onSuccess: () => {
          setSelectedFiles(new Set());
        },
      },
    );
  };

  const handleDelete = (file: MediaFile) => {
    deleteFile(file);
  };

  const deleteFile = (file: MediaFile) => {
    const key = mediaFileKey(file);
    const onSuccess = () => {
      setSelectedFiles((prev) => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    if (file.kind === 'image') {
      deleteImageMut({ filename: file.fileName }, { onSuccess });
      return;
    }
    deleteVideoMut({ filename: file.fileName }, { onSuccess });
  };

  const handleStartMove = () => {
    if (selectionTotal === 0) return;

    setMoveMode(true);
  };

  const handleCancelMove = () => {
    setMoveMode(false);
  };

  const handlePickTargetFolder = (folderId: number | null) => {
    if (!moveMode || selectionTotal === 0) return;

    moveMediaBatch(
      {
        folderId,
        imageIds: selectionCounts.imageIds,
        videoIds: selectionCounts.videoIds,
      },
      {
        onSuccess: () => {
          setMoveMode(false);
          setSelectedFiles(new Set());
        },
      },
    );
  };

  return {
    media,
    isLoading,
    childFolders,

    preview,
    handleOpenPreview,
    handleClosePreview,

    selectedFolderId,
    handleSelectFolder,

    selectedFiles,
    handleToggleSelect,
    handleClearSelection,

    selectionTotal,

    moveMode,
    isMoving,

    handleDelete,
    handleBulkDelete,
    handleStartMove,
    handleCancelMove,
    handlePickTargetFolder,
  };
}
