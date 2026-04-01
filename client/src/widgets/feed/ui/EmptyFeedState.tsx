export function EmptyFeedState() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-lg border-(--border) border-4 border-dashed bg-(--card-bg) p-18">
        <span className="material-symbols-outlined text-(--text) text-4xl">
          Новостные ленты не подключены
        </span>
      </div>
    </div>
  );
}
