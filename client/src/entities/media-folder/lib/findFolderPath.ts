import type { MediaFolderTree } from '@shared/types/media.folder';

export function findFolderPath(
  tree: MediaFolderTree[],
  targetId: number,
  path: number[] = [],
): number[] | null {
  for (const node of tree) {
    const currentPath = [...path, node.id];
    if (node.id === targetId) return currentPath;
    if (node.children.length > 0) {
      const found = findFolderPath(node.children, targetId, currentPath);
      if (found) return found;
    }
  }
  return null;
}
