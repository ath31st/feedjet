/** biome-ignore-all lint/a11y: disable all a11y rules */
import { useState } from 'react';
import {
  useMediaFolderTree,
  useMediaStats,
  useCreateFolder,
  useRenameFolder,
  useDeleteFolder,
  type MediaFolderTree,
} from '@/entities/media-folder';
import { Folder, Plus, Check, X } from 'lucide-react';
import { FolderNode } from './FolderNode';

interface FolderTreePanelProps {
  selectedFolderId: number | null;
  onSelectFolder: (id: number | null) => void;
}

export function FolderTreePanel({
  selectedFolderId,
  onSelectFolder,
}: FolderTreePanelProps) {
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const { data: tree = [] } = useMediaFolderTree();
  const { data: stats } = useMediaStats();

  const createFolder = useCreateFolder();
  const renameFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();

  const handleRename = () => {
    if (!renamingId || !renameValue.trim()) {
      return;
    }

    renameFolder.mutate({
      id: renamingId,
      name: renameValue.trim(),
    });

    setRenamingId(null);
    setRenameValue('');
  };

  const handleDelete = (id: number) => {
    deleteFolder.mutate({ id });

    if (selectedFolderId === id) {
      onSelectFolder(null);
    }
  };

  const handleCancelRename = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const handleStartRename = (folder: MediaFolderTree) => {
    setRenamingId(folder.id);
    setRenameValue(folder.name);
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6">
      <div className="flex-1 overflow-y-auto">
        <div
          className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm transition-colors ${
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

        {showNewFolder ? (
          <div className="mt-1 flex items-center gap-1 px-2">
            <input
              autoFocus
              placeholder="Имя папки"
              className="flex-1 rounded-lg border border-(--border) px-2 py-0.5 text-sm outline-none"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newFolderName.trim()) {
                  createFolder.mutate({
                    name: newFolderName.trim(),
                    parentId: selectedFolderId,
                  });

                  setNewFolderName('');
                  setShowNewFolder(false);
                }

                if (e.key === 'Escape') {
                  setShowNewFolder(false);
                  setNewFolderName('');
                }
              }}
            />

            <button
              onClick={() => {
                if (!newFolderName.trim()) {
                  return;
                }

                createFolder.mutate({
                  name: newFolderName.trim(),
                  parentId: selectedFolderId,
                });

                setNewFolderName('');
                setShowNewFolder(false);
              }}
            >
              <Check size={14} className="text-green-500" />
            </button>

            <button
              onClick={() => {
                setShowNewFolder(false);
                setNewFolderName('');
              }}
            >
              <X size={14} className="text-red-500" />
            </button>
          </div>
        ) : (
          <button
            className="mt-2 flex w-full items-center gap-1 rounded px-2 py-1 text-(--text-muted) text-xs hover:bg-(--bg)"
            onClick={() => setShowNewFolder(true)}
          >
            <Plus size={12} />
            Новая папка
          </button>
        )}
      </div>

      {stats && (
        <p className="text-(--text-muted) text-xs">
          {stats.imageCount} изображений · {stats.videoCount} видео
        </p>
      )}
    </aside>
  );
}
