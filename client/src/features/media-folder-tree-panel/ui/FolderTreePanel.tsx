/** biome-ignore-all lint/a11y: disable all a11y rules */
import { useState } from 'react';
import {
  useMediaFolderTree,
  useMediaStats,
  useCreateFolder,
  useRenameFolder,
  useDeleteFolder,
} from '@/entities/media-folder';
import type { MediaFolderTree } from '@/entities/media-folder';
import { Folder, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { FolderNode } from './FolderNode';

interface FolderTreePanelProps {
  selectedFolderId: number | null;
  onSelectFolder: (id: number | null) => void;
}

interface ContextMenuState {
  x: number;
  y: number;
  node: MediaFolderTree;
}

export function FolderTreePanel({
  selectedFolderId,
  onSelectFolder,
}: FolderTreePanelProps) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const { data: tree = [] } = useMediaFolderTree();
  const { data: stats } = useMediaStats();

  const createFolder = useCreateFolder();
  const renameFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();

  return (
    <>
      {contextMenu && (
        <div
          className="fixed z-40 min-w-40 rounded-lg border border-(--border) bg-(--button-bg) py-1 shadow-xl"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-(--button-hover-bg)"
            onClick={() => {
              setRenamingId(contextMenu.node.id);
              setRenameValue(contextMenu.node.name);
              setContextMenu(null);
            }}
          >
            <Pencil size={14} />
            Переименовать
          </button>

          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-red-500 text-sm hover:bg-(--button-hover-bg)"
            onClick={() => {
              if (confirm(`Удалить папку «${contextMenu.node.name}»?`)) {
                deleteFolder.mutate({ id: contextMenu.node.id });

                if (selectedFolderId === contextMenu.node.id) {
                  onSelectFolder(null);
                }
              }

              setContextMenu(null);
            }}
          >
            <Trash2 size={14} />
            Удалить
          </button>
        </div>
      )}

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
              onSelect={onSelectFolder}
              onContextMenu={(e, n) => {
                e.preventDefault();

                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  node: n,
                });
              }}
            />
          ))}

          {renamingId !== null && (
            <div className="mt-1 flex items-center gap-1 px-2">
              <input
                autoFocus
                className="flex-1 rounded-lg border border-(--border) px-2 py-0.5 text-sm"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    renameFolder.mutate({
                      id: renamingId,
                      name: renameValue,
                    });

                    setRenamingId(null);
                  }

                  if (e.key === 'Escape') {
                    setRenamingId(null);
                  }
                }}
              />

              <button
                onClick={() => {
                  renameFolder.mutate({
                    id: renamingId,
                    name: renameValue,
                  });

                  setRenamingId(null);
                }}
              >
                <Check size={14} className="text-green-500" />
              </button>

              <button onClick={() => setRenamingId(null)}>
                <X size={14} className="text-red-500" />
              </button>
            </div>
          )}

          {showNewFolder ? (
            <div className="mt-1 flex items-center gap-1 px-2">
              <input
                autoFocus
                placeholder="Имя папки"
                className="flex-1 rounded-lg border border-(--border) px-2 py-0.5 text-sm"
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
                  if (newFolderName.trim()) {
                    createFolder.mutate({
                      name: newFolderName.trim(),
                      parentId: selectedFolderId,
                    });

                    setNewFolderName('');
                  }

                  setShowNewFolder(false);
                }}
              >
                <Check size={14} className="text-green-500" />
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
          <p className="text-xs">
            {stats.imageCount} изображений · {stats.videoCount} видео
          </p>
        )}
      </aside>
    </>
  );
}
