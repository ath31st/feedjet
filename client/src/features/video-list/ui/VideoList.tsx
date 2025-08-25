import { useDeleteFile, useFileList } from '@/entities/video/api/useVideo';
import { Cross2Icon } from '@radix-ui/react-icons';

export function VideoList() {
  const videos = useFileList().data || [];
  const removeVideo = useDeleteFile();

  const handleRemoveVideo = (videoName: string) => {
    removeVideo.mutate({ filename: videoName });
  };

  if (!videos.length) {
    return <div className="text-muted text-sm">Нет загруженных видео</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <ul className="space-y-2">
        {videos.map((v) => (
          <li
            key={v}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-2"
          >
            <span className="truncate">{v}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRemoveVideo(v)}
                className="bg-transparent p-1 hover:opacity-60"
              >
                <Cross2Icon className="h-4 w-4 cursor-pointer" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
