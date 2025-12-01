export function EmptyImageList() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-lg border-4 border-dashed p-4 text-center font-medium text-5xl"
      style={{
        borderColor: 'var(--border)',
        color: 'var(--text)',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      <p>🖼️ Список изображений пуст 🖼️</p>
      <p>Нет доступных изображений для показа</p>
    </div>
  );
}
