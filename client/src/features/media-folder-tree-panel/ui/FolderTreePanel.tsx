/** biome-ignore-all lint/a11y: disable all a11y rules */
import { Folder } from 'lucide-react';
import { FolderNode } from './FolderNode';
import { FolderCreateForm } from './FolderCreateForm';
import { useFolderTreePanel } from '../model/useFolderTreePanel';

interface FolderTreePanelProps {
  selectedFolderId: number | null;
  onSelectFolder: (id: number | null) => void;
}

export function FolderTreePanel({
  selectedFolderId,
  onSelectFolder,
}: FolderTreePanelProps) {
  const {
    tree,
    stats,
    renamingId,
    renameValue,
    handleCancelRename,
    handleCreateFolder,
    handleDelete,
    handleRename,
    handleStartRename,
    setRenameValue,
  } = useFolderTreePanel(selectedFolderId, onSelectFolder);

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4">
      <div className="flex-1 overflow-y-auto">
        <div
          className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm transition-colors ${
            selectedFolderId === null
              ? 'bg-(--button-bg)'
              : 'hover:bg-(--button-hover-bg)'
          }`}
          onClick={() => onSelectFolder(null)}
        >
          <Folder size={14} className="shrink-0" />

          <span>Все файлы</span>
        </div>

        {tree.map((node) => (
          <FolderNode
            key={node.id}
            node={node}
            selectedId={selectedFolderId}
            renamingId={renamingId}
            renameValue={renameValue}
            onRenameValueChange={setRenameValue}
            onStartRename={handleStartRename}
            onRename={handleRename}
            onCancelRename={handleCancelRename}
            onDelete={handleDelete}
            onSelect={onSelectFolder}
          />
        ))}

        <FolderCreateForm onCreate={handleCreateFolder} />
      </div>

      {stats && (
        <p className="text-(--text-muted) text-xs">
          {stats.imageCount} изображений · {stats.videoCount} видео
        </p>
      )}
    </aside>
  );
}
