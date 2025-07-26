import { useEffect, useState } from 'react';
import { AnimatedFeedCard } from '../components/AnimatedFeedCard';
import { FeedCardFrame } from '../components/FeedCardFrame';
import { useKioskConfigStore } from '../stores/kioskConfigStrore';
import { useRssFeedStore } from '../stores/rssFeedStore';
import type { FeedItem } from '@shared/types/feed';

export function FeedPage() {
  const cellsPerPage = useKioskConfigStore(
    (state) => state.config.cellsPerPage,
  );
  const feeds = useRssFeedStore((s) => s.feeds);
  const [visibleItems, setVisibleItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    if (feeds.length === 0) return;
    const newSlice = feeds.slice(0, cellsPerPage);
    setVisibleItems(newSlice);
  }, [feeds, cellsPerPage]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden 4k:p-10 p-4">
      <div className="grid h-full 2x4k:grid-cols-2 4k:grid-cols-1 4k:gap-10 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
        {visibleItems.map((item, index) => (
          <FeedCardFrame key={item.link}>
            <AnimatedFeedCard key={item.link} item={item} index={index} />
          </FeedCardFrame>
        ))}
      </div>
    </div>
  );
}
