import { buildImageUrl, useImageStore } from '@/entities/image';
import { PlaylistState } from '@/shared/constant';
import { useEffect, useRef, useState } from 'react';

interface UseImageViewerProps {
  onViewStart: () => void;
  onViewEnd: () => void;
  isSingleImageWidget: boolean;
  displayDurationMs: number;
}

export function useImageViewer({
  onViewStart,
  onViewEnd,
  isSingleImageWidget,
  displayDurationMs,
}: UseImageViewerProps) {
  const { currentImage, nextImage, resetPlaylist, images } = useImageStore();
  const [playlistState, setPlaylistState] = useState<PlaylistState>(
    PlaylistState.Idle,
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (playlistState === PlaylistState.Idle && images.length > 0) {
      setPlaylistState(PlaylistState.Playing);
      resetPlaylist();
      return;
    }

    if (playlistState === PlaylistState.Playing && !currentImage) {
      if (isSingleImageWidget) {
        setPlaylistState(PlaylistState.Playing);
        resetPlaylist();
        return;
      }

      setPlaylistState(PlaylistState.Finished);
      onViewEnd();
      return;
    }

    if (images.length === 0) {
      setPlaylistState(PlaylistState.Finished);
      onViewEnd();
      return;
    }
  }, [
    playlistState,
    images.length,
    currentImage,
    resetPlaylist,
    onViewEnd,
    isSingleImageWidget,
  ]);

  useEffect(() => {
    if (!currentImage) return;

    onViewStart();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      nextImage();
    }, displayDurationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentImage, nextImage, onViewStart, displayDurationMs]);

  return {
    currentImage,
    url: currentImage
      ? `${buildImageUrl(currentImage.fileName)}?v=${currentImage.mtime}`
      : null,
  };
}
