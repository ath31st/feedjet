import { useCurrentKiosk } from '@/entities/kiosk';
import { VisibleCellCountSelector } from '@/features/cell-count-selector';
import { CarouselSizeSelector } from '@/features/feed-carousel-size-selector';
import { FeedRotationInterval } from '@/features/feed-rotation-interval';
import { SettingsCard } from '@/shared/ui/SettingsCard';
import { StatusMessageCard } from '@/shared/ui/StatusMessageCard';

export function FeedWidgetSettings() {
  const { kiosk, loading } = useCurrentKiosk();

  if (loading) {
    return (
      <StatusMessageCard
        title="Настройки RSS-виджета"
        message="Загрузка киоска..."
        className="w-full md:w-1/2"
      />
    );
  }

  if (!kiosk) {
    return (
      <StatusMessageCard
        title="Настройки RSS-виджета"
        message="Киоск не выбран"
        className="w-full md:w-1/2"
      />
    );
  }

  const { id: kioskId } = kiosk;

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
