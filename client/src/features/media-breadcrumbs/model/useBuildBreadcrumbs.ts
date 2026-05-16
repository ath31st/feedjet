import type { MediaFolderTree } from '@/entities/media-folder';

export function buildBreadcrumbs(
  tree: MediaFolderTree[],
  targetId: number | null,
): Array<{ id: number; name: string }> {
  if (!targetId) return [];
  function find(
    nodes: MediaFolderTree[],
    id: number,
    path: Array<{ id: number; name: string }>,
  ): Array<{ id: number; name: string }> | null {
    for (const node of nodes) {
      const current = [...path, { id: node.id, name: node.name }];
      if (node.id === id) return current;
      const result = find(node.children, id, current);
      if (result) return result;
    }
    return null;
  }
  return find(tree, targetId, []) ?? [];
}
