export function BirthdaysWidget() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-xl border-4 border-dashed p-4 text-center font-medium text-4xl"
      style={{
        borderColor: 'var(--border)',
        color: 'var(--text)',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      <p>🚧 Ведутся работы 🚧</p>
      <p>Дни рождения</p>
    </div>
  );
}
