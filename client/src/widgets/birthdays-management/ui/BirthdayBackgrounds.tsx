export function BirthdayBackgrounds() {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-6 gap-4">
      {months.map((month) => (
        <div
          key={month}
          className="flex aspect-[16/9] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] text-sm"
        >
          Месяц {month}
        </div>
      ))}
    </div>
  );
}
