import { useVideoStore } from '@/entities/video/model/useVideoStore';
import { CommonButton } from '@/shared/ui/common/CommonButton';

export function VideoList() {
  const videos = useVideoStore((s) => s.videos);
  const removeVideo = useVideoStore((s) => s.removeVideo);

  if (!videos.length) {
    return <div className="text-muted text-sm">Нет загруженных видео</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {videos.map((v) => (
        <div
          key={v.id}
          className="flex items-center justify-between rounded border p-2"
        >
          <span className="truncate text-sm">{v.name}</span>
          <CommonButton onClick={() => removeVideo(v.id)} type="button">
            Удалить
          </CommonButton>
        </div>
      ))}
    </div>
  );
}
