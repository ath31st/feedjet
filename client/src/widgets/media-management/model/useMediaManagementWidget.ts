import { useMoveMediaBatch, type MediaFile } from '@/entities/media-folder';
import { useMemo, useState } from 'react';

export function useMediaManagementWidget() {
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
      if (kind === 'image') imageIds.push(id);
      else if (kind === 'video') videoIds.push(id);
    }
    return { imageIds, videoIds };
  }

  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(
    () => new Set(),
  );
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [moveMode, setMoveMode] = useState(false);

  const { mutate: moveMediaBatch, isPending: isMoving } = useMoveMediaBatch();

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore this warning
  const selectionCounts = useMemo(
    () => splitSelectionKeys(selectedFiles),
    [selectedFiles],
  );
  const selectionTotal =
    selectionCounts.imageIds.length + selectionCounts.videoIds.length;

  const handleStartMove = () => {
    if (selectionTotal === 0) return;
    setMoveMode(true);
  };

  const handleCancelMove = () => setMoveMode(false);

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
    handlePickTargetFolder,
    handleStartMove,
    handleCancelMove,
    selectedFolderId,
    setSelectedFolderId,
    selectionTotal,
    moveMode,
    setMoveMode,
    isMoving,
    selectedFiles,
    setSelectedFiles,
  };
}
