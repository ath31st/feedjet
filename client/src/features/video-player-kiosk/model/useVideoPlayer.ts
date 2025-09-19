import { useEffect, useRef } from 'react';
import { SERVER_URL } from '@/shared/config/env';
import { useVideoStore } from '@/entities/video';

export function useVideoPlayer() {
  const { currentVideo, nextVideo } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.pause();
    vid.removeAttribute('src');
    vid.load();

    if (currentVideo) {
      const url = `${SERVER_URL}/video/${currentVideo.fileName}`;
      vid.src = url;
      vid.load();
      vid.play().catch(() => {});
    }
  }, [currentVideo]);

  return {
    videoRef,
    currentVideo,
    onEnded: nextVideo,
    onError: nextVideo,
  };
}
