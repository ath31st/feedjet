import { useEffect, useState } from 'react';
import {
  useGetAllRss,
  useCreateRss,
  useDeleteRss,
  useUpdateRss,
} from '../hooks/useRss';
import {
  useAllowedThemes,
  useUpdateKioskConfig,
} from '../hooks/useKioskConfig';
import { useKioskConfigStore } from '../stores/kioskConfigStrore';
import { useLogout } from '../hooks/useAuth';
import { useReloadKiosks } from '../hooks/useReloadKiosks';

export function AdminPage() {
  const { config } = useKioskConfigStore();
  const [cellCount, setCellCount] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [newFeed, setNewFeed] = useState('');
  const updateKioskConfig = useUpdateKioskConfig();
  const createRss = useCreateRss();
  const deleteRss = useDeleteRss();
  const updateRss = useUpdateRss();
  const logout = useLogout();
  const reload = useReloadKiosks();
  const { data: feeds, isLoading: feedsLoading } = useGetAllRss();
  const { data: themes } = useAllowedThemes();
  type Theme = NonNullable<typeof themes>[number];

  useEffect(() => {
    if (config) {
      setCellCount(config.cellsPerPage);
      setTheme(config.theme);
    }
  }, [config]);

  const handleCellCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val)) {
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

  const handleLogout = () => {
    logout();
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Theme;
    setTheme(selected);
    updateKioskConfig.mutate({ data: { theme: selected } });
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
            <button
              type="button"
              onClick={handleAddFeed}
              className="rounded-lg bg-[var(--button-bg)] px-4 py-2 text-[var(--button-text)] hover:opacity-80 disabled:opacity-50"
            >
              Добавить
            </button>
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
          <button
            type="button"
            onClick={() => reload.mutate()}
            className="rounded-lg bg-[var(--button-bg)] px-4 py-2 text-[var(--button-text)] hover:opacity-80"
          >
            Обновить
          </button>
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

        <section
          className="w-full rounded-xl p-6 md:w-1/2"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <h2 className="mb-4 font-semibold text-xl">Выход из аккаунта</h2>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-[var(--button-bg)] px-4 py-2 text-[var(--button-text)] hover:opacity-80"
          >
            Выход
          </button>
        </section>
      </div>
    </div>
  );
}
