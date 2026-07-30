import { useDeleteImageGlobal } from '@/entities/image';
import {
  useDeleteMediaBatch,
  useMediaInFolder,
  useMoveMediaBatch,
  type MediaFile,
} from '@/entities/media-folder';
import { useDeleteVideoGlobal } from '@/entities/video';
import { useEffect, useMemo, useState } from 'react';

function mediaKey(file: MediaFile): string {
  return `${file.kind}-${file.id}`;
}

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
  const { data: media = [], isLoading } = useMediaInFolder(selectedFolderId);

  const selectionTotal =
    selectionCounts.imageIds.length + selectionCounts.videoIds.length;

  useEffect(() => {
    setSelectedFiles((prev) => {
      if (prev.size === 0) return prev;

      const valid = new Set(media.map(mediaKey));
      const next = new Set([...prev].filter((key) => valid.has(key)));

      return next.size === prev.size ? prev : next;
    });
  }, [media]);

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
    const key = mediaKey(file);
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

    preview,
    setPreview,

    selectedFolderId,
    setSelectedFolderId,

    selectedFiles,
    setSelectedFiles,

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
