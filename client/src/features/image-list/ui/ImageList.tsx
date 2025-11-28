import { formatBytes } from '@/shared/lib';
import { Cross1Icon } from '@radix-ui/react-icons';
import { IconButton } from '@/shared/ui/common';
import * as Switch from '@radix-ui/react-switch';
import {
  useImageMetadataList,
  useRemoveImageFile,
  useUpdateIsActiveImageMetadata,
} from '@/entities/image';

export function ImageList() {
  const { data: images = [], isLoading } = useImageMetadataList();
  const { mutate: removeImage, isPending } = useRemoveImageFile();
  const { mutate: updateIsActive, isPending: isActivePending } =
    useUpdateIsActiveImageMetadata();

  const handleRemoveImage = (imageName: string) => {
    removeImage({ filename: imageName });
  };

  if (isLoading) {
    return <div className="text-[var(--meta-text)] text-sm">Загрузка...</div>;
  }

  if (!images.length) {
    return (
      <div className="text-[var(--meta-text)] text-sm">
        Нет загруженных изображений
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      {images
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((v) => (
          <div
            key={v.fileName}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-2"
          >
            <div className="flex flex-col overflow-hidden">
              <span className="truncate">{v.name}</span>
              <span className="text-[var(--meta-text)] text-xs">
                {v.width}x{v.height}px · {v.format} · {formatBytes(v.size)} ·{' '}
                {new Date(v.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="ml-2 flex flex-shrink-0 items-center gap-2">
              <Switch.Root
                checked={v.isActive}
                disabled={isActivePending}
                onCheckedChange={(checked) =>
                  updateIsActive({ filename: v.fileName, isActive: checked })
                }
                className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-[var(--border)] transition-colors data-[state=checked]:bg-[var(--button-bg)]"
              >
                <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-[var(--text)] transition-transform data-[state=checked]:translate-x-[21px]" />
              </Switch.Root>

              <IconButton
                disabled={isPending}
                onClick={() => handleRemoveImage(v.fileName)}
                tooltip="Удалить изображение"
                icon={<Cross1Icon className="h-4 w-4 cursor-pointer" />}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
