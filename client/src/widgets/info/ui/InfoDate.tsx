interface InfoDateProps {
  date: Date;
}

export function InfoDate({ date }: InfoDateProps) {
  return (
    <div className="text-center font-semibold text-6xl leading-tight">
      {date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
      <div className="text-5xl text-[var(--meta-text)]">
        {new Date().toLocaleDateString('ru-RU', { weekday: 'long' })}
      </div>
    </div>
  );
}
