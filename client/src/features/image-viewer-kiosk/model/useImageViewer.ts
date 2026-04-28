import { buildImageUrl, useImageStore } from '@/entities/image';
import { PlaylistState } from '@/shared/constant';
import { useEffect, useRef, useState } from 'react';

interface UseImageViewerProps {
  onViewEnd: () => void;
  isSingleImageWidget: boolean;
}

export function useImageViewer({
  onViewEnd,
  isSingleImageWidget,
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

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (currentImage.durationSeconds === 0) {
      nextImage();
      return;
    }

    const durationMs = currentImage.durationSeconds * 1000;

    timerRef.current = setTimeout(() => {
      nextImage();
    }, durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentImage, nextImage]);

  return {
    currentImage,
    url: currentImage
      ? `${buildImageUrl(currentImage.fileName)}?v=${currentImage.mtime}`
      : null,
  };
}
