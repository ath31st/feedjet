import type { FeedItem } from '@/entities/feed';
import { LazyImage } from './LazyImage';
import noImageAvailableUrl from '@/shared/assets/images/no-image-available.jpg';

interface FeedCardProps {
  item: FeedItem;
  cellsPerPage: number;
}

export function FeedCard({ item, cellsPerPage }: FeedCardProps) {
  return (
    <a
      href={item.link}
      target="_blank"
      className="flex h-full overflow-hidden rounded-xl transition"
      style={{
        backgroundColor: 'var(--card-bg)',
      }}
    >
      <div className="z-1 w-[30%] flex-shrink-0 overflow-hidden rounded-xl">
        <LazyImage src={item.image || noImageAvailableUrl} alt={''} />
      </div>

      <div className="flex min-w-0 flex-grow flex-col gap-2 px-4">
        <div
          className={`min-w-0 truncate text-${cellsPerPage > 6 ? 'xs' : 'sm'}`}
          style={{ color: 'var(--category-text)' }}
        >
          {item.categories.join(', ')}
        </div>
        <h2 className={`font-semibold text-${cellsPerPage > 6 ? 'xs' : 'sm'}`}>
          {item.title}
        </h2>
        <p
          className={`${cellsPerPage > 4 ? 'line-clamp-5' : 'line-clamp-8'} text-${cellsPerPage > 6 ? 'xs' : 'sm'}`}
          style={{ color: 'var(--description-text)' }}
        >
          {item.description}
        </p>
        <div
          className={`mt-auto text-${cellsPerPage > 6 ? 'xs' : 'sm'}`}
          style={{ color: 'var(--meta-text)' }}
        >
          {item.author} · {new Date(item.pubDate).toLocaleString('ru-RU')}
        </div>
      </div>
    </a>
  );
}
