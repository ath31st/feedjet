import { useEffect, useState } from 'react';
import { AnimatedFeedCard } from './AnimatedFeedCard';
import type { FeedItem } from '@/entities/feed';
import { useRssFeedStore } from '@/entities/feed';
import { useFeedConfigStore } from '@/entities/feed-config';
import { isRotate90 } from '@/shared/lib/parseRotateParam';

interface FeedCardProps {
  rotate: number;
}

export function FeedWidget({ rotate }: FeedCardProps) {
  const cellsPerPage = useFeedConfigStore(
    (state) => state.feedConfig.cellsPerPage,
  );
  const feeds = useRssFeedStore((s) => s.feeds);
  const [visibleItems, setVisibleItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    if (feeds.length === 0) return;
    const newSlice = feeds.slice(0, cellsPerPage);
    setVisibleItems(newSlice);
  }, [feeds, cellsPerPage]);

  return (
    <div
      className={`grid h-full w-full grid-cols-1 gap-4 ${
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
