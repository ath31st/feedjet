import { EmptyVideoPlaylist } from './EmptyVideoPlaylist';
import { useVideoPlayer } from '../model/useVideoPlayer';

export function VideoPlayerKiosk() {
  const { videoRef, currentVideo, onEnded, onError } = useVideoPlayer();

  if (!currentVideo) return <EmptyVideoPlaylist />;

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
