import { CommonButton } from '@/shared/ui/common/CommonButton';
import { useRssManagement } from '../model/useRssManagement';
import { PlusIcon } from '@radix-ui/react-icons';

export function FeedAddForm() {
  const { newFeed, setNewFeed, handleAddFeed } = useRssManagement();

  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Новая RSS ссылка"
        value={newFeed}
        onChange={(e) => setNewFeed(e.target.value)}
        className="flex-grow rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
      />
      <CommonButton type="button" onClick={handleAddFeed}>
        <PlusIcon className="" />
      </CommonButton>
    </div>
  );
}
