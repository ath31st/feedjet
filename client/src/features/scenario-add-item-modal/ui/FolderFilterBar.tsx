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
      <span className="mr-1 font-medium text-xs">Папка:</span>
      <button
        type="button"
        onClick={() => setFolderFilter(null)}
        className={`h-8 rounded-md border px-3 text-xs transition-colors ${
          folderFilter === null
            ? 'border-blue-500 bg-blue-500/10 text-blue-500'
            : ''
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
              ? 'border-blue-500 bg-blue-500/10 text-blue-500'
              : ''
          }`}
          style={{ paddingLeft: `${12 + f.depth * 8}px` }}
        >
          {'/ '.repeat(f.depth)}
          {f.name}
        </button>
      ))}
    </div>
  );
}
