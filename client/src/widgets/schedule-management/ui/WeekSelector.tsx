interface WeekSelectorProps {
  weeks: { label: string; date: Date; key: string }[];
  weekStart: Date;
  onChange: (date: Date) => void;
}

export function WeekSelector({
  weeks,
  weekStart,
  onChange,
}: WeekSelectorProps) {
  return (
    <div className="flex w-full items-center justify-center">
      {weeks.map((w) => {
        const isActive = weekStart.getTime() === w.date.getTime();
        return (
          <button
            key={w.key}
            type="button"
            onClick={() => onChange(w.date)}
            className={`relative w-38 px-6 py-2 font-medium text-md outline-none transition-colors hover:text-[color:var(--border)] ${
              isActive
                ? 'text-[color:var(--text)] hover:text-[color:var(--text)]'
                : 'text-muted-foreground'
            }`}
          >
            {isActive && (
              <span
                className="pointer-events-none absolute top-0 right-0 left-0 h-full"
                style={{
                  background:
                    'linear-gradient(to bottom, color-mix(in srgb, var(--border) 20%, transparent) 0%, transparent 80%)',
                }}
              />
            )}
            <span className="relative z-10">{w.label}</span>
          </button>
        );
      })}
    </div>
  );
}
