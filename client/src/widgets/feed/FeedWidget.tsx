import { AnimatedFeedCard } from './AnimatedFeedCard';
import { useRssFeedStore } from '@/entities/feed';
import { useFeedConfigStore } from '@/entities/feed-config';
import { isRotate90 } from '@/shared/lib/parseRotateParam';
import { useCarousel } from '@/shared/lib/useCarousel';

interface FeedCardProps {
  rotate: number;
}

export function FeedWidget({ rotate }: FeedCardProps) {
  const { cellsPerPage, pagesCount, carouselIntervalMs } = useFeedConfigStore(
    (s) => s.feedConfig,
  );
  const feeds = useRssFeedStore((s) => s.feeds);

  const visibleItems = useCarousel(
    feeds,
    cellsPerPage,
    pagesCount,
    carouselIntervalMs,
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
          cellsPerPage={cellsPerPage}
          index={index}
        />
      ))}
    </div>
  );
}
