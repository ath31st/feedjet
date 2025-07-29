import { useEffect, useState } from 'react';
import { AnimatedFeedCard } from './AnimatedFeedCard';
import type { FeedItem } from '@/entities/feed';
import { useRssFeedStore } from '@/entities/feed';
import { useFeedConfigStore } from '@/entities/feed-config';

export function FeedWidget() {
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

  const cols = Math.ceil(Math.sqrt(cellsPerPage));
  const rows = Math.ceil(cellsPerPage / cols);

  return (
    <div
      className="feed-grid grid h-full w-full 4k:gap-8 gap-4 md:grid-cols-2 xl:grid-cols-3"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
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
