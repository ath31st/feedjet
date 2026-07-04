import { buildVideoUrl } from '@/entities/video';

interface Props {
  fileName: string;
  onEnd: () => void;
  isPreview?: boolean;
}

export const VideoItemView = ({ fileName, onEnd, isPreview }: Props) => {
  return (
    <div className="fixed inset-0 z-50">
      <video
        muted={isPreview}
        src={buildVideoUrl(fileName)}
        autoPlay
        playsInline
        onEnded={onEnd}
        className="relative z-10 h-full w-full"
      >
        <track kind="captions" label="no captions" />
      </video>
    </div>
  );
};
