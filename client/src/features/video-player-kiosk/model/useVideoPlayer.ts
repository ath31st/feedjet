import { useEffect, useRef } from 'react';
import { buildVideoUrl, useVideoStore } from '@/entities/video';

export function useVideoPlayer() {
  const { currentVideo, nextVideo, videos } = useVideoStore();
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

  const handleEnded = () => {
    if (videos.length <= 1) {
      const vid = videoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    } else {
      nextVideo();
    }
  };

  return {
    videoRef,
    currentVideo,
    onEnded: handleEnded,
    onError: handleEnded,
  };
}
