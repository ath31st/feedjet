import type { MediaFolderTree } from '@shared/types/media.folder';

export function getChildFolders(
  tree: MediaFolderTree[],
  selectedFolderId: number | null,
): MediaFolderTree[] {
  if (selectedFolderId === null) return [];

  const walk = (nodes: MediaFolderTree[]): MediaFolderTree[] | null => {
    for (const node of nodes) {
      if (node.id === selectedFolderId) return node.children;
      const found = walk(node.children);
      if (found) return found;
    }
    return null;
  };

  return walk(tree) ?? [];
}
