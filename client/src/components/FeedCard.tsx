import type { FeedItem } from '../mocks/feed';

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      className="flex flex-col md:flex-row bg-white text-black rounded-xl overflow-hidden transition max-w-full"
    >
      <div className="flex-shrink-0 w-full md:w-48 4k:w-[640px] aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-grow min-w-0">
        <div className="text-xs 4k:text-4xl text-gray-500">{item.category}</div>
        <h2 className="text-lg md:text-xl 4k:text-5xl font-semibold leading-snug">
          {item.title}
        </h2>
        <p className="text-sm md:text-base 4k:text-5xl text-gray-700 line-clamp-6">
          {item.description}
        </p>
        <div className="text-xs md:text-sm 4k:text-4xl text-gray-400 mt-auto">
          {item.author} · {new Date(item.pubDate).toLocaleString('ru-RU')}
        </div>
      </div>
    </a>
  );
}
