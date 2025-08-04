import { AnimatedFeedCard } from './AnimatedFeedCard';
import { useFeedCarouselStore, useRssFeedStore } from '@/entities/feed';
import { useFeedConfigStore } from '@/entities/feed-config';
import { isRotate90 } from '@/shared/lib/parseRotateParam';
import { useCarousel } from '@/shared/lib/useCarousel';

interface FeedCardProps {
  rotate: number;
}

export function FeedWidget({ rotate }: FeedCardProps) {
  const { visibleCellCount, carouselIntervalMs } = useFeedConfigStore(
    (s) => s.feedConfig,
  );
  const feeds = useRssFeedStore((s) => s.feeds);
  const { startIndex, setStartIndex } = useFeedCarouselStore();
  const visibleItems = useCarousel(
    feeds,
    visibleCellCount,
    carouselIntervalMs,
    startIndex,
    setStartIndex,
  );

  return (
    <div
      className={`grid h-full w-full grid-flow-row auto-rows-fr grid-cols-1 gap-4 ${
        isRotate90(rotate) ? '' : 'xl:grid-cols-2'
      }`}
    >
      {visibleItems.map((item, index) => (
        <AnimatedFeedCard
          key={item.link}
          item={item}
          index={index}
          cellsCount={visibleCellCount}
        />
      ))}
    </div>
  );
}
