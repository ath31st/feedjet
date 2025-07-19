import type { FeedItem } from '../mocks/feed';
import { LazyImage } from './LazyImage';

interface FeedCardProps {
  item: FeedItem;
}

export function FeedCard({ item }: FeedCardProps) {
  return (
    <a
      href={item.link}
      target="_blank"
      className="flex h-full max-w-full flex-col overflow-hidden 4k:rounded-4xl rounded-xl transition md:flex-row"
      style={{
        backgroundColor: 'var(--card-bg)',
        color: 'var(--card-text)',
      }}
    >
      <div className="z-1 aspect-[4/3] 4k:w-[640px] w-full flex-shrink-0 overflow-hidden 4k:rounded-4xl rounded-xl md:w-24 lg:w-40 xl:w-72">
        <LazyImage src={item.image} alt={''} />
      </div>

      <div className="flex min-w-0 flex-grow flex-col 4k:gap-4 gap-2 p-4">
        <div
          className="4k:text-4xl text-xs"
          style={{ color: 'var(--category-text)' }}
        >
          {item.category}
        </div>
        <h2 className="font-semibold 4k:text-5xl text-base leading-snug">
          {item.title}
        </h2>
        <p
          className="line-clamp-6 4k:text-5xl text-sm"
          style={{ color: 'var(--description-text)' }}
        >
          {item.description}
        </p>
        <div
          className="mt-auto 4k:text-4xl text-xs"
          style={{ color: 'var(--meta-text)' }}
        >
          {item.author} · {new Date(item.pubDate).toLocaleString('ru-RU')}
        </div>
      </div>
    </a>
  );
}
