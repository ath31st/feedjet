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
    <div className="fixed inset-0 z-50">
      <VideoPlayerKiosk
        onVideoStart={onVideoStart}
        onVideoEnd={onVideoEnd}
        isSingleVideoWidget={isSingleVideoWidget}
      />
    </div>
  );
}
