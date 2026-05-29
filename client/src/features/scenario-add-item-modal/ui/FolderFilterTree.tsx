import type { MediaFolderTree } from '@/entities/media-folder';
import { useEffect, useState } from 'react';
import { FolderFilterNode } from './FolderFilterNode';
import { FolderTreeItem, FolderTreeContainer } from '@/shared/ui';

interface Props {
  tree: MediaFolderTree[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

function findPath(
  tree: MediaFolderTree[],
  targetId: number,
  path: number[] = [],
): number[] | null {
  for (const node of tree) {
    const currentPath = [...path, node.id];
    if (node.id === targetId) return currentPath;
    if (node.children?.length) {
      const res = findPath(node.children, targetId, currentPath);
      if (res) return res;
    }
  }
  return null;
}

export function FolderFilterTree({ tree, selectedId, onSelect }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!selectedId) return;
    const path = findPath(tree, selectedId);
    if (!path) return;
    setExpandedIds(new Set(path));
  }, [selectedId, tree]);

  const toggle = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <FolderTreeContainer
      rootRow={
        <FolderTreeItem
          name="Все файлы"
          isSelected={selectedId === null}
          onClick={() => onSelect(null)}
        />
      }
    >
      {tree.map((node) => (
        <FolderFilterNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
          expandedIds={expandedIds}
          toggle={toggle}
          depth={0}
        />
      ))}
    </FolderTreeContainer>
  );
}
