export function NotFoundPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div
        className="rounded-xl border-2 4k:p-28 p-12 text-2xl"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        Страница не найдена (404)
      </div>
    </div>
  );
}
