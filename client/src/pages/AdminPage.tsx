import { useEffect, useState } from 'react';
import {
  useGetAllRss,
  useCreateRss,
  useDeleteRss,
  useUpdateRss,
} from '../entities/rss';
import { useUpdateKioskConfig } from '../features/feed-config';
import { useFeedConfigStore } from '../entities/feed-config';
import { themes, type Theme } from '@shared/types/ui.config';
import { useUiConfigStore } from '@/entities/ui-config';
import { useUpdateUiConfig } from '@/features/ui-config';
import { ReloadKioskPageButton } from '@/features/reload-kiosk';
import { CommonButton } from '@/shared/ui/common/CommonButton';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';

export function AdminPage() {
  const { feedConfig } = useFeedConfigStore();
  const { uiConfig } = useUiConfigStore();
  const [cellCount, setCellCount] = useState(0);
  const [theme, setTheme] = useState<Theme>('dark');
  const [newFeed, setNewFeed] = useState('');
  const updateKioskConfig = useUpdateKioskConfig();
  const updateUiConfig = useUpdateUiConfig();
  const createRss = useCreateRss();
  const deleteRss = useDeleteRss();
  const updateRss = useUpdateRss();
  const { data: feeds, isLoading: feedsLoading } = useGetAllRss();

  useEffect(() => {
    if (feedConfig) {
      setCellCount(feedConfig.cellsPerPage);
    }
  }, [feedConfig]);

  useEffect(() => {
    if (uiConfig) {
      setTheme(uiConfig.theme);
    }
  }, [uiConfig]);

  const handleCellCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val) && val >= 1 && val <= 9) {
      setCellCount(val);
      updateKioskConfig.mutate({ data: { cellsPerPage: val } });
    }
  };

  const handleAddFeed = () => {
    const url = newFeed.trim();
    if (!url) return;
    createRss.mutate(
      { url },
      {
        onSuccess: () => setNewFeed(''),
      },
    );
  };

  const handleDeleteFeed = (id: number) => {
    deleteRss.mutate({ id });
  };

  const handleUpdateFeed = (id: number, url?: string, isActive?: boolean) => {
    updateRss.mutate({ id, data: { url, isActive } });
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setTheme(selected);
    updateUiConfig.mutate({ data: { theme: selected } });
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
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Новая RSS ссылка"
              value={newFeed}
              onChange={(e) => setNewFeed(e.target.value)}
              className="flex-grow rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
            />
            <CommonButton
              type="button"
              text="Добавить"
              onClick={handleAddFeed}
            />
          </div>
          {feeds && (
            <ul className="space-y-2">
              {feeds.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span className="truncate">{item.url}</span>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={() =>
                        handleUpdateFeed(item.id, undefined, !item.isActive)
                      }
                      className="h-5 w-5 cursor-pointer hover:opacity-50 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFeed(item.id)}
                      className="cursor-pointer text-red-500 hover:opacity-50 disabled:opacity-50"
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
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
          {themes?.length ? (
            <select
              style={{
                backgroundColor: 'var(--card-bg)',
              }}
              value={theme}
              onChange={handleThemeChange}
              className="w-32 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
            >
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <p>Темы недоступны</p>
          )}
        </section>
      </div>
    </div>
  );
}
