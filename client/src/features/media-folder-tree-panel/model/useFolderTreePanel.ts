import {
  useCreateFolder,
  useDeleteFolder,
  useMediaFolderTree,
  useMediaStats,
  useRenameFolder,
  type MediaFolderTree,
} from '@/entities/media-folder';
import { useState } from 'react';

export function useFolderTreePanel(
  selectedFolderId: number | null,
  onSelectFolder: (id: number | null) => void,
) {
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const { data: tree = [] } = useMediaFolderTree();
  const { data: stats } = useMediaStats();

  const { mutate: createFolder } = useCreateFolder();
  const { mutate: renameFolder } = useRenameFolder();
  const { mutate: deleteFolder } = useDeleteFolder();

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

  return {
    tree,
    stats,
    renamingId,
    renameValue,
    setRenameValue,
    handleRename,
    handleDelete,
    handleCancelRename,
    handleStartRename,
    handleCreateFolder,
  };
}
