import { ReloadKioskPageButton } from '@/features/reload-kiosk';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';
import { ThemeSelector } from '@/features/theme-selector';
import { FeedAddForm, FeedList } from '@/features/rss-management';
import { CellCountSelector } from '@/features/cell-count-selector';
import { WidgetSelector } from '@/features/widget-selector';
import { WidgetRotaionInterval } from '@/features/widget-rotation-interval';
import { PagesCountSelector } from '@/features/feed-pages-count-selector';
import { FeedRotaionInterval } from '@/features/feed-rotation-interval';

export function AdminPage() {
  return (
    <div className="flex w-screen flex-wrap gap-y-6 p-12">
      <div className="absolute top-6 right-6">
        <LogoutButton />
      </div>
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
          <h2 className="mb-4 font-semibold text-xl">Настройки оформления</h2>
          <div className="flex flex-col gap-4">
            <label htmlFor="theme" className="mb-2 block">
              Тема:
            </label>
            <ThemeSelector />
            <label htmlFor="widget" className="mb-2 block">
              Виджеты в ротации:
            </label>
            <WidgetSelector />
            <label htmlFor="rotation-interval" className="mb-2 block">
              Интервал смены виджетов (в секундах):
            </label>
            <WidgetRotaionInterval />
          </div>
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
          <h2 className="mb-4 font-semibold text-xl">Настройки RSSS виджета</h2>
          <label htmlFor="cell-count" className="mb-2 block">
            Количество ячеек на страницу:
          </label>
          <CellCountSelector />
          <label htmlFor="pages-count" className="mb-2 block">
            Количество страниц:
          </label>
          <PagesCountSelector />
          <label htmlFor="rotation-interval" className="mb-2 block">
            Интервал движения карусели фидов (в секундах):
          </label>
          <FeedRotaionInterval />
        </section>
        <section
          className="w-full rounded-xl p-6 md:w-1/2"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <h2 className="mb-4 font-semibold text-xl">
            Обновление страницы киоска
          </h2>
          <ReloadKioskPageButton />
        </section>
      </div>
    </div>
  );
}
