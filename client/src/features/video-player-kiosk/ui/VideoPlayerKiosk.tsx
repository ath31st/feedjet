import { useEffect, useRef } from 'react';
import { useVideoStore } from '@/entities/video';
import { EmptyVideoPlaylist } from './EmptyVideoPlaylist';
import { SERVER_URL } from '@/shared/config/env';

interface VideoPlayerKioskProps {
  rotate?: number;
}

export function VideoPlayerKiosk({ rotate }: VideoPlayerKioskProps) {
  const { currentVideo, initStore, nextVideo, playId } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initStore();
  }, [initStore]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  if (!currentVideo) return <EmptyVideoPlaylist />;

  return (
    <video
      ref={videoRef}
      key={`${currentVideo.fileName}-${playId}`}
      src={`${SERVER_URL}/video/${currentVideo.fileName}`}
      className="h-screen w-screen"
      autoPlay
      muted
      playsInline
      onEnded={() => nextVideo()}
    >
      <track kind="captions" label="no captions" />
    </video>
  );
}
