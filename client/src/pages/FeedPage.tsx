import { mockFeed } from '../mocks/feed';
import { FeedCard } from '../components/FeedCard';

export default function FeedPage() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden 4k:p-10 p-2">
      <div className="grid h-full 4k:grid-cols-1 4k:gap-10 gap-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
        {mockFeed.slice(0, 6).map((item) => (
          <FeedCard key={item.link} item={item} />
        ))}
      </div>
    </div>
  );
}
