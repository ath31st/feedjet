import { findFolderPath, type MediaFolderTree } from '@/entities/media-folder';
import { useEffect, useState } from 'react';

export function useFolderFilterTree(
  tree: MediaFolderTree[],
  selectedId: number | null,
) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (selectedId === null) return;
    const path = findFolderPath(tree, selectedId);
    if (!path) return;
    setExpandedIds(new Set(path));
  }, [selectedId, tree]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return { expandedIds, toggleExpand };
}
