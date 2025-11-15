import {
  buildBackgroundUrl,
  useGetBackgrounds,
} from '@/entities/birthday-background';

export function BirthdayBackgrounds() {
  const { data: backgrounds, isLoading } = useGetBackgrounds();

  if (isLoading) {
    return <div className="text-sm opacity-50">Загрузка…</div>;
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      {backgrounds?.map(({ monthNumber, monthName, fileName }) => {
        const url = fileName ? buildBackgroundUrl(fileName) : null;

        return (
          <div key={monthNumber} className="flex flex-col gap-1">
            <div className="text-[var(--meta-text)] text-sm">{monthName}</div>

            <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-muted)]">
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
