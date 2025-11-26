import { VideoPlayerKiosk } from '@/features/video-player-kiosk';

interface VideoPlayerWidgetProps {
  onVideoStart: () => void;
  onVideoEnd: () => void;
  isSingleVideoWidget: boolean;
}

export function VideoPlayerWidget({
  onVideoStart,
  onVideoEnd,
  isSingleVideoWidget,
}: VideoPlayerWidgetProps) {
  return (
    <VideoPlayerKiosk
      onVideoStart={onVideoStart}
      onVideoEnd={onVideoEnd}
      isSingleVideoWidget={isSingleVideoWidget}
    />
  );
}
