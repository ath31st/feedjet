import { VideoPlayerKiosk } from '@/features/video-player-kiosk';

interface VideoPlayerWidgetProps {
  rotate: number;
}

export function VideoPlayerWidget({ rotate }: VideoPlayerWidgetProps) {
  return <VideoPlayerKiosk rotate={rotate} />;
}
