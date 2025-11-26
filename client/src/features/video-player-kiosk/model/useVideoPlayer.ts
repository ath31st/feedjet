import { useEffect, useRef, useState } from 'react';
import { buildVideoUrl, useVideoStore } from '@/entities/video';
import { PlaylistState } from '../lib/playlistState';

interface UseVideoPlayerProps {
  onVideoStart: () => void;
  onVideoEnd: () => void;
  isSingleVideoWidget: boolean;
}

export function useVideoPlayer({
  onVideoStart,
  onVideoEnd,
  isSingleVideoWidget,
}: UseVideoPlayerProps) {
  const { currentVideo, nextVideo, resetPlaylist, videos } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playlistState, setPlaylistState] = useState<PlaylistState>(
    PlaylistState.Idle,
  );

  useEffect(() => {
    if (playlistState === PlaylistState.Idle && videos.length > 0) {
      setPlaylistState(PlaylistState.Playing);
      resetPlaylist();
      return;
    }

    if (playlistState === PlaylistState.Playing && !currentVideo) {
      if (isSingleVideoWidget) {
        setPlaylistState(PlaylistState.Playing);
        resetPlaylist();
        return;
      }

      setPlaylistState(PlaylistState.Finished);
      onVideoEnd();
      return;
    }
    if (videos.length === 0) {
      setPlaylistState(PlaylistState.Finished);
      onVideoEnd();
      return;
    }
  }, [
    playlistState,
    currentVideo,
    videos.length,
    resetPlaylist,
    onVideoEnd,
    isSingleVideoWidget,
  ]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !currentVideo) return;

    vid.pause();
    vid.removeAttribute('src');
    vid.load();

    vid.src = buildVideoUrl(currentVideo.fileName);
    vid.load();
    vid
      .play()
      .then(() => onVideoStart())
      .catch(() => {});
  }, [currentVideo, onVideoStart]);

  const handleEnded = () => {
    nextVideo();
  };

  return {
    videoRef,
    currentVideo,
    onEnded: handleEnded,
    onError: handleEnded,
  };
}
