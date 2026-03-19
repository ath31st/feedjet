import {
  buildBackgroundUrl,
  type BirthdayBackground,
} from '@/entities/birthday-background';

interface BackgroundGridProps {
  backgrounds: BirthdayBackground[];
  onSlotClick: (month: number, fileName: string | null) => void;
}

export function BackgroundGrid({
  backgrounds,
  onSlotClick,
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
              <button
                type="button"
                onClick={() => onSlotClick(monthNumber, fileName)}
                className="relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-(--border) bg-(--bg-muted) hover:bg-(--button-hover-bg)"
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
            </div>
          );
        },
      )}
    </div>
  );
}
