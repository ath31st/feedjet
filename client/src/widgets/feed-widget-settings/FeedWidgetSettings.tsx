import { VisibleCellCountSelector } from '@/features/cell-count-selector';
import { CarouselSizeSelector } from '@/features/feed-carousel-size-selector';
import { FeedRotationInterval } from '@/features/feed-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';

interface FeedWidgetSettingsProps {
  kioskId: number;
}

export function FeedWidgetSettings({ kioskId }: FeedWidgetSettingsProps) {
  return (
    <SettingsCard title="Настройки RSS-виджета" className="w-full md:w-1/2">
      <div className="flex flex-col gap-4">
        <VisibleCellCountSelector kioskId={kioskId} />
        <CarouselSizeSelector kioskId={kioskId} />
        <FeedRotationInterval kioskId={kioskId} />
      </div>
    </SettingsCard>
  );
}
