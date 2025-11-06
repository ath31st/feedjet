import { AnimatedFeedCard } from './AnimatedFeedCard';
import {
  useFeedCarouselStore,
  useRssFeedStore,
  sortAndSliceFeeds,
} from '@/entities/feed';
import { useFeedConfigStore } from '@/entities/feed-config';
import { isRotate90, useCarousel, type AnimationType } from '@/shared/lib';
import { EmptyFeedState } from './EmptyFeedState';
import { Activity } from 'react';

interface FeedWidgetProps {
  rotate: number;
  animation: AnimationType;
}

export function FeedWidget({ rotate, animation }: FeedWidgetProps) {
  const { visibleCellCount, carouselIntervalMs, carouselSize } =
    useFeedConfigStore((s) => s.feedConfig);
  const feeds = useRssFeedStore((s) => s.feeds);
  const { startIndex, setStartIndex } = useFeedCarouselStore();
  const slicedFeedItems = sortAndSliceFeeds(feeds, carouselSize);
  const visibleItems = useCarousel(
    slicedFeedItems,
    visibleCellCount,
    carouselIntervalMs,
    startIndex,
    setStartIndex,
  );

  if (slicedFeedItems.length === 0) {
    return <EmptyFeedState />;
  }

  return (
    <div
      className={`grid h-full w-full grid-flow-row auto-rows-fr grid-cols-1 gap-4 ${
        isRotate90(rotate) ? '' : 'xl:grid-cols-2'
      }`}
    >
      {visibleItems.map((item, index) => (
        <Activity key={item.link} mode="visible">
          <AnimatedFeedCard
            key={item.link}
            item={item}
            index={index}
            cellsCount={visibleCellCount}
            animation={animation}
          />
        </Activity>
      ))}
    </div>
  );
}
