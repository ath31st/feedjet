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
      {backgrounds.map(({ monthNumber, monthName, fileName }) => {
        const url = fileName ? buildBackgroundUrl(fileName) : null;
        return (
          <div key={monthNumber} className="flex flex-col gap-1">
            <div className="text-[var(--meta-text)] text-sm">{monthName}</div>
            <button
              type="button"
              onClick={() => onSlotClick(monthNumber, fileName)}
              className="relative flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] hover:bg-[var(--button-hover-bg)]"
            >
              {url ? (
                <img
                  src={url}
                  alt={monthName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[var(--meta-text)] text-sm">
                  Нет фона
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
