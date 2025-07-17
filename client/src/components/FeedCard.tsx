import type { FeedItem } from '../mocks/feed';

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      className="flex flex-col bg-white text-black rounded-xl overflow-hidden shadow-lg hover:scale-[1.01] transition"
    >
      <img src={item.image} alt="" className="w-full h-64 object-cover" />
      <div className="p-4 flex flex-col gap-2">
        <div className="text-xs text-gray-500">{item.category}</div>
        <h2 className="text-lg font-semibold leading-snug">{item.title}</h2>
        <p className="text-sm text-gray-700 line-clamp-3">{item.description}</p>
        <div className="text-xs text-gray-400 mt-auto">
          {item.author} · {new Date(item.pubDate).toLocaleString('ru-RU')}
        </div>
      </div>
    </a>
  );
}
