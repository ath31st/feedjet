import { useEffect, useState } from 'react';
import { mockFeed } from '../mocks/feed';
import { AnimatedFeedCard } from '../components/AnimatedFeedCard';
import { FeedCardFrame } from '../components/FeedCardFrame';
import { useKioskConfigStore } from '../stores/kioskConfigStrore';

const INTERVAL_MS = 400000;

export function FeedPage() {
  const cellsPerPage = useKioskConfigStore(
    (state) => state.config?.cellsPerPage,
  );
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % mockFeed.length);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const visibleItems = Array.from({ length: cellsPerPage }).map((_, i) => {
    const index = (startIndex + cellsPerPage - 1 - i) % mockFeed.length;
    return mockFeed[index];
  });

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
