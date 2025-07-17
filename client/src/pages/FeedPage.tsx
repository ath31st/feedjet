import { mockFeed } from '../mocks/feed';
import { FeedCard } from '../components/FeedCard';

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-black p-4">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 4k-landscape:grid-cols-2 4k-portrait:grid-cols-1">
        {mockFeed.map((item) => (
          <FeedCard key={item.link} item={item} />
        ))}
      </div>
    </div>
  );
}
