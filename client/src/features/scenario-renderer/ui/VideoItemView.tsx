import { buildVideoUrl } from '@/entities/video';

export const VideoItemView = ({
  fileName,
  onEnd,
}: {
  fileName: string;
  onEnd: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50">
      <video
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
