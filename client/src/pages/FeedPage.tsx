import { mockFeed } from '../mocks/feed';
import { FeedCard } from '../components/FeedCard';

export default function FeedPage() {
  return (
    <div className="h-screen w-screen p-6 flex flex-col overflow-hidden">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 4k:grid-cols-1 gap-2 4k:gap-6 h-full">
        {mockFeed.slice(0, 6).map((item) => (
          <FeedCard key={item.link} item={item} />
        ))}
      </div>
    </div>
  );
}
