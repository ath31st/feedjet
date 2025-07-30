import { ReloadKioskPageButton } from '@/features/reload-kiosk';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import { ThemeSelector } from '@/features/theme-selector';
import { FeedAddForm, FeedList } from '@/features/rss-management';
import { CellCountSelector } from '@/features/feed-config';

export function AdminPage() {
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
          <h2 className="mb-4 font-semibold text-xl">Управление RSS-лентами</h2>
          <FeedAddForm />
          <FeedList />
        </section>
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
          <CellCountSelector min={1} max={9} />
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
    </div>
  );
}
