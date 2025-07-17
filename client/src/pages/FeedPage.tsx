import { mockFeed } from '../mocks/feed';
import { FeedCard } from '../components/FeedCard';

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Лента новостей</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 4k:grid-cols-4">
        {mockFeed.map((item, idx) => (
          <FeedCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}
