import type { FeedItem } from '../mocks/feed';

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      className="flex max-w-full flex-col overflow-hidden rounded-xl transition md:flex-row"
      style={{
        backgroundColor: 'var(--card-bg)',
        color: 'var(--card-text)',
      }}
    >
      <div className="aspect-[4/3] 4k:w-[640px] w-full flex-shrink-0 overflow-hidden md:w-48">
        <img
          src={item.image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
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
