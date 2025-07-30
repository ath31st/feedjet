import { useEffect, useState } from 'react';
import { useGetAllRss } from '../entities/rss';
import { useUpdateKioskConfig } from '../features/feed-config';
import { useFeedConfigStore } from '../entities/feed-config';
import { ReloadKioskPageButton } from '@/features/reload-kiosk';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import { ThemeSelector } from '@/features/theme-selector';
import { FeedAddForm, FeedList } from '@/features/rss-management';

export function AdminPage() {
  const { feedConfig } = useFeedConfigStore();
  const [cellCount, setCellCount] = useState(0);
  const updateKioskConfig = useUpdateKioskConfig();
  const { data: feeds, isLoading: feedsLoading } = useGetAllRss();

  useEffect(() => {
    if (feedConfig) {
      setCellCount(feedConfig.cellsPerPage);
    }
  }, [feedConfig]);

  const handleCellCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val) && val >= 1 && val <= 9) {
      setCellCount(val);
      updateKioskConfig.mutate({ data: { cellsPerPage: val } });
    }
  };

  return (
    <div className="flex w-screen flex-wrap gap-y-6 p-12">
      <LogoutButton />
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
          {feedsLoading && <p>Загрузка...</p>}
          {feeds && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {feeds
                .filter((item) => item.isActive)
                .map((item) => (
                  <li key={item.id}>{item.url}</li>
                ))}
            </ul>
          )}
        </section>

        <section
          className="w-full rounded-xl p-6 md:w-1/2"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <h2 className="mb-4 font-semibold text-xl">Управление RSS-лентами</h2>
          <FeedAddForm />
          <FeedList />
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
          <h2 className="mb-4 font-semibold text-xl">Обновление страницы</h2>
          <ReloadKioskPageButton />
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
          <h2 className="mb-4 font-semibold text-xl">Выбор темы оформления</h2>
          <ThemeSelector />
        </section>
      </div>
    </div>
  );
}
