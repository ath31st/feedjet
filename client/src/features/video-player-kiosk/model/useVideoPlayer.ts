import { useEffect, useRef } from 'react';
import { buildVideoUrl, useVideoStore } from '@/entities/video';

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
      vid.src = buildVideoUrl(currentVideo.fileName);
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
