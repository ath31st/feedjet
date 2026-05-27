import { FolderIcon } from 'lucide-react';

interface FolderFilterBarProps {
  folderFilter: number | null;
  setFolderFilter: (id: number | null) => void;
  flatFolders: Array<{ id: number; name: string; depth: number }>;
}

export function FolderFilterBar({
  folderFilter,
  setFolderFilter,
  flatFolders,
}: FolderFilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5">
      <div className="flex flex-row items-center gap-1">
        <FolderIcon size={24} />
        <span>:</span>
      </div>

      <button
        type="button"
        onClick={() => setFolderFilter(null)}
        className={`h-8 rounded-md border px-3 text-xs transition-colors ${
          folderFilter === null
            ? 'border-(--border) bg-(--button-hover-bg)/10 font-medium ring-(--button-hover-bg)/90 ring-2'
            : 'border-(--border) text-(--text-muted) hover:border-(--button-hover-bg)/50'
        }`}
      >
        Все файлы
      </button>

      {flatFolders.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => setFolderFilter(f.id)}
          className={`h-8 rounded-md border px-3 text-xs transition-colors ${
            folderFilter === f.id
              ? 'border-(--border) bg-(--button-hover-bg)/10 font-medium ring-(--button-hover-bg)/90 ring-2'
              : 'border-(--border) text-(--text-muted) hover:border-(--button-hover-bg)/50'
          }`}
          style={{ paddingLeft: `${12 + f.depth * 8}px` }}
        >
          {'/'.repeat(f.depth)}
          {f.name}
        </button>
      ))}
    </div>
  );
}
