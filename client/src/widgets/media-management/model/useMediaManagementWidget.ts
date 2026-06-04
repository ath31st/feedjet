import {
  useDeleteMediaBatch,
  useMoveMediaBatch,
  type MediaFile,
} from '@/entities/media-folder';
import { useMemo, useState } from 'react';

function splitSelectionKeys(keys: Set<string>): {
  imageIds: number[];
  videoIds: number[];
} {
  const imageIds: number[] = [];
  const videoIds: number[] = [];

  for (const key of keys) {
    const [kind, idStr] = key.split('-');
    const id = Number(idStr);

    if (!Number.isFinite(id)) continue;

    if (kind === 'image') {
      imageIds.push(id);
    } else if (kind === 'video') {
      videoIds.push(id);
    }
  }

  return { imageIds, videoIds };
}

export function useMediaManagementWidget() {
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

  const selectionTotal =
    selectionCounts.imageIds.length + selectionCounts.videoIds.length;

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
    preview,
    setPreview,

    selectedFolderId,
    setSelectedFolderId,

    selectedFiles,
    setSelectedFiles,

    selectionTotal,

    moveMode,
    isMoving,

    handleBulkDelete,
    handleStartMove,
    handleCancelMove,
    handlePickTargetFolder,
  };
}
