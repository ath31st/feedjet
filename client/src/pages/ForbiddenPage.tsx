export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8 rounded-lg border border-(--border) bg-(--card-bg) p-12">
        <h1 className="text-4xl">Доступ запрещен</h1>
        <h1 className="text-2xl">Обратитесь к администратору</h1>
      </div>
    </div>
  );
}
