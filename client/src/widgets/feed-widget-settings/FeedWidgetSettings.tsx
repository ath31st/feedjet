import { VisibleCellCountSelector } from '@/features/cell-count-selector';
import { CarouselSizeSelector } from '@/features/feed-carousel-size-selector';
import { FeedRotationInterval } from '@/features/feed-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';

export function FeedWidgetSettings() {
  return (
    <SettingsCard title="Настройки RSS-виджета" className="w-full md:w-1/2">
      <div className="flex flex-col gap-4">
        <VisibleCellCountSelector />
        <CarouselSizeSelector />
        <FeedRotationInterval />
      </div>
    </SettingsCard>
  );
}
