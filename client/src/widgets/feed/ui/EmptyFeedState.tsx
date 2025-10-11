export function EmptyFeedState() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-xl border-4 border-[var(--border)] border-dashed bg-[var(--card-bg)] p-18">
        <span className="material-symbols-outlined text-4xl text-[var(--text)]">
          Новостные ленты не подключены
        </span>
      </div>
    </div>
  );
}
