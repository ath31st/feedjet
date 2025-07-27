export function ScheduleWidget() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center 4k:gap-20 gap-10 rounded-xl 4k:border-12 border-4 border-dashed 4k:p-12 p-4 text-center font-medium 4k:text-9xl text-4xl"
      style={{
        borderColor: 'var(--border)',
        color: 'var(--text)',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      <p>🚧 Ведутся работы 🚧</p>
      <p>Расписание</p>
    </div>
  );
}
