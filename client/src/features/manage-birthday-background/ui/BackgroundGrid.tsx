/** biome-ignore-all lint/a11y: disable all a11y rules */
import {
  buildBackgroundUrl,
  type BirthdayBackground,
} from '@/entities/birthday-background';
import { FileDropZone } from '@/shared/ui';

interface BackgroundGridProps {
  backgrounds: BirthdayBackground[];
  onSlotClick: (month: number, fileName: string | null) => void;
  onDropFile: (month: number, file: File) => void;
}

export function BackgroundGrid({
  backgrounds,
  onSlotClick,
  onDropFile,
}: BackgroundGridProps) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {backgrounds.map(
        ({ monthNumber, monthName, fileName, thumbnail, mtime }) => {
          const thumbnailUrl = thumbnail
            ? `${buildBackgroundUrl(thumbnail)}?v=${mtime}`
            : null;

          return (
            <div key={monthNumber} className="flex flex-col gap-1">
              <div className="text-(--meta-text) text-sm">{monthName}</div>
              <FileDropZone
                onDrop={(files) => {
                  const file = files[0];
                  if (file) onDropFile(monthNumber, file);
                }}
                className="relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-(--bg-muted) hover:bg-(--button-hover-bg)"
                inactiveClassName="border-(--border)"
                activeClassName="border-dashed border-(--button-hover-bg) bg-(--button-hover-bg)/20"
              >
                <button
                  type="button"
                  onClick={() => onSlotClick(monthNumber, fileName)}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center"
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={monthName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-(--meta-text) text-sm">Нет фона</span>
                  )}
                </button>
              </FileDropZone>
            </div>
          );
        },
      )}
    </div>
  );
}
