import * as Switch from '@radix-ui/react-switch';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useRssManagement } from '../model/useRssManagement';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { IconButton } from '@/shared/ui/common/IconButton';

export function FeedList() {
  const { feeds, feedsLoading, handleDeleteFeed, handleUpdateFeed } =
    useRssManagement();

  if (feedsLoading) return <LoadingThreeDotsJumping />;
  if (!feeds?.length) return <p>В базе данных нет RSS-лент</p>;

  return (
    <ul className="space-y-2">
      {feeds.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between rounded-lg border border-[var(--border)] px-4 py-2"
        >
          <span className="truncate">{item.url}</span>
          <div className="flex items-center gap-2">
            <Switch.Root
              checked={item.isActive}
              onCheckedChange={(checked) =>
                handleUpdateFeed(item.id, undefined, checked)
              }
              className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-[var(--border)] transition-colors data-[state=checked]:bg-[var(--button-bg)]"
            >
              <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-[var(--text)] transition-transform data-[state=checked]:translate-x-[21px]" />
            </Switch.Root>

            <IconButton
              onClick={() => handleDeleteFeed(item.id)}
              ariaLabel="Удалить ленту"
              icon={<Cross1Icon className="h-4 w-4 cursor-pointer" />}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
