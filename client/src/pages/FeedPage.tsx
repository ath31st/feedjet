import { mockFeed } from '../mocks/feed';
import { FeedCard } from '../components/FeedCard';
import { useTheme } from '../providers/ThemeProvider';

export default function FeedPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen w-screen p-6 flex flex-col overflow-hidden">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="px-4 py-2 rounded-md transition"
          style={{
            backgroundColor: 'var(--button-bg)',
            color: 'var(--button-text)',
          }}
        >
          {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        </button>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 4k:grid-cols-1 gap-2 4k:gap-6 h-full">
        {mockFeed.slice(0, 6).map((item) => (
          <FeedCard key={item.link} item={item} />
        ))}
      </div>
    </div>
  );
}
