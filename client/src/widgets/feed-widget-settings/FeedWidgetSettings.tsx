import { CellCountSelector } from '@/features/cell-count-selector';
import { PagesCountSelector } from '@/features/feed-pages-count-selector';
import { FeedRotationInterval } from '@/features/feed-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';

export function FeedWidgetSettings() {
  return (
    <SettingsCard title="Настройки RSS-виджета" className="w-full md:w-1/2">
      <div className="flex flex-col">
        <label htmlFor="cell-count" className="mb-2 block">
          Количество ячеек на страницу:
        </label>
        <CellCountSelector />

        <label htmlFor="pages-count" className="mb-2 block">
          Количество страниц:
        </label>
        <PagesCountSelector />

        <label htmlFor="feed-rotation-interval" className="mb-2 block">
          Интервал движения карусели фидов (в секундах):
        </label>
        <FeedRotationInterval />
      </div>
    </SettingsCard>
  );
}
