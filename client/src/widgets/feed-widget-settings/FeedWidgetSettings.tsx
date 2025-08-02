import { CellCountSelector } from '@/features/cell-count-selector';
import { PagesCountSelector } from '@/features/feed-pages-count-selector';
import { FeedRotationInterval } from '@/features/feed-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';

export function FeedWidgetSettings() {
  return (
    <SettingsCard title="Настройки RSS-виджета" className="w-full md:w-1/2">
      <div className="flex flex-col">
        <CellCountSelector />
        <PagesCountSelector />
        <FeedRotationInterval />
      </div>
    </SettingsCard>
  );
}
