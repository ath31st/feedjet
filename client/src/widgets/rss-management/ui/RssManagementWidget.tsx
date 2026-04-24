import { VisibleCellCountSelector } from '@/features/cell-count-selector';
import { CarouselSizeSelector } from '@/features/feed-carousel-size-selector';
import { FeedRotationInterval } from '@/features/feed-rotation-interval';
import { FeedAddForm } from '@/features/rss-management';
import { FeedList } from '@/features/rss-management';
import { SettingsCard } from '@/shared/ui/SettingsCard';

interface RssManagementWidgetProps {
  kioskId: number;
}

export function RssManagementWidget({ kioskId }: RssManagementWidgetProps) {
  return (
    <div className="flex w-full flex-row items-start gap-6">
      <SettingsCard title="Управление RSS-лентами" className="w-full md:w-3/5">
        <FeedAddForm />
        <FeedList />
      </SettingsCard>
      <div className="flex w-full flex-col gap-6 md:w-2/5">
        <SettingsCard title={`Интервал "вращения" ленты`}>
          <FeedRotationInterval kioskId={kioskId} />
        </SettingsCard>

        <SettingsCard title="Настройки RSS-виджета">
          <div className="flex flex-col gap-4">
            <VisibleCellCountSelector kioskId={kioskId} />
            <CarouselSizeSelector kioskId={kioskId} />
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}
