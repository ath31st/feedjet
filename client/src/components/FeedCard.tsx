import type { FeedItem } from '@shared/types/feed';
import { LazyImage } from './LazyImage';

interface FeedCardProps {
  item: FeedItem;
  cellsPerPage: number;
}

export function FeedCard({ item, cellsPerPage }: FeedCardProps) {
  return (
    <a
      href={item.link}
      target="_blank"
      className="flex h-full overflow-hidden 4k:rounded-4xl rounded-xl transition"
      style={{
        backgroundColor: 'var(--card-bg)',
      }}
    >
      <div></div>
      <div className="z-1 4k:w-140 w-[30%] flex-shrink-0 overflow-hidden 4k:rounded-4xl rounded-xl">
        <LazyImage src={item.image} alt={''} />
      </div>

      <div className="flex min-w-0 flex-grow flex-col 4k:gap-4 gap-2 p-4">
        <div
          className={`4k:text-3xl text-${cellsPerPage > 6 ? 'sm' : 'xs'}`}
          style={{ color: 'var(--category-text)' }}
        >
          {item.categories.join(', ')}
        </div>
        <h2
          className={`font-semibold text-base ${
            cellsPerPage > 6 ? '4k:text-4xl' : '4k:text-5xl'
          }`}
        >
          {item.title}
        </h2>
        <p
          className={`4k:line-clamp-16 ${cellsPerPage > 4 ? 'line-clamp-5' : 'line-clamp-8'} 4k:${
            cellsPerPage > 6 ? 'text-2xl' : 'text-3xl'
          } text-${cellsPerPage > 6 ? 'sm' : 'md'}`}
          style={{ color: 'var(--description-text)' }}
        >
          {item.description}
        </p>
        <div
          className={`mt-auto 4k:text-2xl text-${cellsPerPage > 6 ? 'sm' : 'xs'}`}
          style={{ color: 'var(--meta-text)' }}
        >
          {item.author} · {new Date(item.pubDate).toLocaleString('ru-RU')}
        </div>
      </div>
    </a>
  );
}
