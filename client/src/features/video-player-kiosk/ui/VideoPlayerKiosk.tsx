import { useEffect, useRef } from 'react';
import { useVideoStore } from '@/entities/video';
import { EmptyVideoPlaylist } from './EmptyVideoPlaylist';
import { SERVER_URL } from '@/shared/config/env';

export function VideoPlayerKiosk() {
  const { currentVideo, nextVideo } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileName = currentVideo?.fileName;

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.pause();
    vid.removeAttribute('src');
    vid.load();

    if (currentVideo) {
      const url = `${SERVER_URL}/video/${fileName}`;
      vid.src = url;
      vid.load();
      vid.play().catch(() => {});
    }
  }, [fileName, currentVideo]);

  if (!currentVideo) return <EmptyVideoPlaylist />;

  return (
    <video
      ref={videoRef}
      className="relative z-10 h-full w-full"
      autoPlay
      muted
      playsInline
      onEnded={() => nextVideo()}
      onError={() => nextVideo()}
    >
      <track kind="captions" label="no captions" />
    </video>
  );
}
