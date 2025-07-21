import { useState } from 'react';

export function AdminPage() {
  const [feeds, setFeeds] = useState<string[]>([
    'https://example.com/rss',
    'https://another-source.com/feed',
  ]);
  const [newFeed, setNewFeed] = useState('');
  const [cellCount, setCellCount] = useState(12);

  const handleAddFeed = () => {
    if (newFeed.trim() && !feeds.includes(newFeed.trim())) {
      setFeeds((prev) => [...prev, newFeed.trim()]);
      setNewFeed('');
    }
  };

  const handleDeleteFeed = (url: string) => {
    setFeeds((prev) => prev.filter((f) => f !== url));
  };

  const handleCellCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val)) setCellCount(val);
  };

  return (
    <div className="flex w-screen flex-wrap gap-y-6 p-12">
      <div className="flex w-full gap-x-6">
        <section
          className="w-full rounded-xl p-6 md:w-1/2"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <h2 className="mb-4 font-semibold text-xl">Текущая конфигурация</h2>
          <p>Ячеек на странице: {cellCount}</p>
          <p className="mt-4 font-semibold">RSS-ленты:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {feeds.map((url) => (
              <li key={url}>{url}</li>
            ))}
          </ul>
        </section>

        <section
          className="w-full rounded-xl p-6 md:w-1/2"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <h2 className="mb-4 font-semibold text-xl">Управление RSS-лентами</h2>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Новая RSS ссылка"
              value={newFeed}
              onChange={(e) => setNewFeed(e.target.value)}
              className="flex-grow rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
            />
            <button
              type="button"
              onClick={handleAddFeed}
              className="rounded-lg bg-[var(--button-bg)] px-4 py-2 text-[var(--button-text)] hover:opacity-80"
            >
              Добавить
            </button>
          </div>
          <ul className="space-y-2">
            {feeds.map((url) => (
              <li key={url} className="flex items-center justify-between">
                <span className="truncate">{url}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteFeed(url)}
                  className="text-red-500 hover:opacity-50"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="flex w-full gap-x-6">
        <section
          className="w-full rounded-xl p-6 md:w-1/2"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <h2 className="mb-4 font-semibold text-xl">Настройки отображения</h2>
          <label htmlFor="cell-count" className="mb-2 block">
            Количество ячеек на страницу:
          </label>
          <input
            id="cell-count"
            type="number"
            value={cellCount}
            onChange={handleCellCountChange}
            className="w-32 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
          />
        </section>
        <section
          className="w-full rounded-xl p-6 md:w-1/2"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <h2 className="mb-4 font-semibold text-xl">
            Обновление RSS-ленты в киоске
          </h2>
          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className="rounded-lg bg-[var(--button-bg)] px-4 py-2 text-[var(--button-text)] hover:opacity-80"
          >
            Обновить
          </button>
        </section>
      </div>
    </div>
  );
}
