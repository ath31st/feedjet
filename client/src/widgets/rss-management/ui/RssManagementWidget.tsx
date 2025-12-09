import { useCurrentKiosk } from '@/entities/kiosk';
import { VisibleCellCountSelector } from '@/features/cell-count-selector';
import { CarouselSizeSelector } from '@/features/feed-carousel-size-selector';
import { FeedRotationInterval } from '@/features/feed-rotation-interval';
import { FeedAddForm } from '@/features/rss-management';
import { FeedList } from '@/features/rss-management';
import { StatusMessageCard } from '@/shared/ui';
import { SettingsCard } from '@/shared/ui/SettingsCard';

export function RssManagementWidget() {
  const { kiosk, loading } = useCurrentKiosk();

  if (loading) {
    return (
      <StatusMessageCard
        title="Настройки оформления"
        message="Загрузка киоска..."
        className="w-full"
      />
    );
  }

  const { id: kioskId } = kiosk;

  return (
    <div className="flex w-full flex-row gap-6">
      <SettingsCard title="Управление RSS-лентами" className="w-full md:w-2/3">
        <FeedAddForm />
        <FeedList />
      </SettingsCard>
      <SettingsCard title="Настройки RSS-виджета" className="w-full md:w-1/3">
        <div className="flex flex-col gap-4">
          <VisibleCellCountSelector kioskId={kioskId} />
          <CarouselSizeSelector kioskId={kioskId} />
          <FeedRotationInterval kioskId={kioskId} />
        </div>
      </SettingsCard>
    </div>
  );
}
