import { useState } from 'react';
import { CommonButton } from '@/shared/ui/common';
import { PlusIcon } from '@radix-ui/react-icons';
import { useRssManagement } from '../model/useRssManagement';

export function FeedAddForm() {
  const [open, setOpen] = useState(false);
  const {
    newFeedUrl,
    newFeedName,
    handleUrlInput,
    handleNameInput,
    handleAddFeed,
  } = useRssManagement();

  return (
    <div className="mb-4 flex w-full flex-col">
      <CommonButton type="button" onClick={() => setOpen((v) => !v)}>
        <div className="flex flex-row items-center justify-center gap-2">
          <PlusIcon />
          {'Добавить RSS-ленту'}
        </div>
      </CommonButton>

      <div
        className={[
          'overflow-hidden transition-all duration-300',
          open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="mt-2 flex flex-col gap-2">
          <input
            type="url"
            placeholder="Введите название ленты"
            value={newFeedName}
            onChange={handleNameInput}
            className="flex-grow rounded-lg border border-(--border) bg-transparent px-3 py-2 focus:outline-none focus:ring-(--border) focus:ring-1"
          />

          <input
            type="url"
            placeholder="Введите RSS ссылку"
            value={newFeedUrl}
            onChange={handleUrlInput}
            className="flex-grow rounded-lg border border-(--border) bg-transparent px-3 py-2 focus:outline-none focus:ring-(--border) focus:ring-1"
          />

          <CommonButton
            type="button"
            onClick={() => {
              handleAddFeed();
              setOpen(false);
            }}
          >
            Сохранить
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
