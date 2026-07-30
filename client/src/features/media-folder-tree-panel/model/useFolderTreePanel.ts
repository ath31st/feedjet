import {
  findFolderPath,
  useCreateFolder,
  useDeleteFolder,
  useMediaFolderTree,
  useMediaStats,
  useRenameFolder,
  type MediaFolderTree,
} from '@/entities/media-folder';
import { useEffect, useState } from 'react';

export function useFolderTreePanel(
  selectedFolderId: number | null,
  onSelectFolder: (id: number | null) => void,
  onPickTargetFolder: ((folderId: number | null) => void) | undefined,
  moveMode: boolean,
  isMovePending: boolean,
) {
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set());

  const { data: tree = [] } = useMediaFolderTree();
  const { data: stats } = useMediaStats();

  const { mutate: createFolder } = useCreateFolder();
  const { mutate: renameFolder } = useRenameFolder();
  const { mutate: deleteFolder } = useDeleteFolder();

  useEffect(() => {
    if (selectedFolderId === null) return;
    const path = findFolderPath(tree, selectedFolderId);
    if (!path) return;
    setExpandedIds(new Set(path));
  }, [selectedFolderId, tree]);

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRename = () => {
    if (!renamingId || !renameValue.trim()) {
      return;
    }

    renameFolder({
      id: renamingId,
      name: renameValue.trim(),
    });

    setRenamingId(null);
    setRenameValue('');
  };

  const handleDelete = (id: number) => {
    deleteFolder({ id });

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

  const handleCreateFolder = (name: string) => {
    createFolder({
      name,
      parentId: selectedFolderId,
    });
  };

  const handleSelect = (id: number | null) => {
    if (moveMode) {
      if (isMovePending) return;
      onPickTargetFolder?.(id);
      return;
    }
    onSelectFolder(id);
  };

  return {
    tree,
    stats,
    renamingId,
    renameValue,
    setRenameValue,
    expandedIds,
    handleToggleExpand,
    handleRename,
    handleDelete,
    handleCancelRename,
    handleStartRename,
    handleCreateFolder,
    handleSelect,
  };
}
