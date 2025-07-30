import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { useRssManagement } from '../model/useRssManagement';

export function FeedList() {
  const { feeds, feedsLoading, handleDeleteFeed, handleUpdateFeed } =
    useRssManagement();

  if (feedsLoading) return <LoadingThreeDotsJumping />;

  if (!feeds?.length) return <p>В базе данных нет RSS-лент</p>;

  return (
    <ul className="space-y-2">
      {feeds.map((item) => (
        <li key={item.id} className="flex items-center justify-between">
          <span className="truncate">{item.url}</span>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={item.isActive}
              onChange={() =>
                handleUpdateFeed(item.id, undefined, !item.isActive)
              }
              className="h-5 w-5 cursor-pointer hover:opacity-50 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => handleDeleteFeed(item.id)}
              className="cursor-pointer text-red-500 hover:opacity-50 disabled:opacity-50"
            >
              ❌
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
