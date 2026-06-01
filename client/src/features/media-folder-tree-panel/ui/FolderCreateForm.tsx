import { useState } from 'react';
import { CommonButton } from '@/shared/ui/common';
import { Plus } from 'lucide-react';

interface FolderCreateFormProps {
  onCreate: (name: string) => void;
}

export function FolderCreateForm({ onCreate }: FolderCreateFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;

    onCreate(name.trim());

    setName('');
    setOpen(false);
  };

  return (
    <div className="mt-6 flex w-full flex-col text-sm">
      <CommonButton type="button" onClick={() => setOpen((v) => !v)}>
        <div className="flex flex-row items-center gap-2">
          <Plus size={12} />
          <span className="text-(--text)">Создать папку</span>
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
            placeholder="Имя папки"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-(--border) bg-transparent p-2 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') {
                setName('');
                setOpen(false);
              }
            }}
          />

          <CommonButton
            type="button"
            disabled={!name.trim()}
            onClick={handleCreate}
          >
            Создать
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
