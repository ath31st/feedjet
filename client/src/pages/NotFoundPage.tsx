export function NotFoundPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div
        className="4k:rounded-4xl rounded-xl 4k:border-4 border-2 4k:p-28 p-12 4k:text-8xl text-2xl"
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
