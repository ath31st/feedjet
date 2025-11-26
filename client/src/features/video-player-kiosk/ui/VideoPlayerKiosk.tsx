import { useVideoPlayer } from '../model/useVideoPlayer';

interface VideoPlayerKioskProps {
  onVideoStart: () => void;
  onVideoEnd: () => void;
  isSingleVideoWidget: boolean;
}

export function VideoPlayerKiosk({
  onVideoStart,
  onVideoEnd,
  isSingleVideoWidget,
}: VideoPlayerKioskProps) {
  const { videoRef, currentVideo, onEnded, onError } = useVideoPlayer({
    onVideoStart,
    onVideoEnd,
    isSingleVideoWidget,
  });

  if (!currentVideo) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      className="relative z-10 h-full w-full"
      autoPlay
      muted
      playsInline
      onEnded={onEnded}
      onError={onError}
    >
      <track kind="captions" label="no captions" />
    </video>
  );
}
