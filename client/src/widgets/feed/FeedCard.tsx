import type { FeedItem } from '@/entities/feed';
import { LazyImage } from './LazyImage';
import noImageAvailableUrl from '@/shared/assets/images/no-image-available.jpg';

interface FeedCardProps {
  item: FeedItem;
  cellsCount: number;
}

export function FeedCard({ item, cellsCount }: FeedCardProps) {
  return (
    <div className="flex h-full rounded-xl bg-[var(--card-bg)] p-2 shadow-2xl">
      <div className="flex overflow-hidden">
        <div className="z-1 w-[30%] flex-shrink-0 overflow-hidden rounded-xl">
          <LazyImage src={item.image || noImageAvailableUrl} alt={''} />
        </div>

        <div className="flex h-full min-w-0 flex-col gap-2 px-4">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[var(--category-text)] text-xs">
            {item.categories.join(', ')}
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-1">
            <div className="overflow-hidden font-semibold text-xs">
              {item.title}
            </div>

            <div className="relative flex-1 overflow-hidden">
              <p className="text-[var(--description-text)] text-xs">
                {item.description}
              </p>
              <div className="pointer-events-none absolute bottom-0 left-0 h-6 w-full bg-gradient-to-t from-[var(--card-bg)] to-transparent" />
            </div>
          </div>
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[var(--meta-text)] text-xs">
            {item.author} · {new Date(item.pubDate).toLocaleString('ru-RU')}
          </div>
        </div>
      </div>
    </div>
  );
}
