import { Folder } from 'lucide-react';
import type { MediaFolderTree } from '@/entities/media-folder';
import { useEffect, useState } from 'react';
import { FolderFilterNode } from './FolderFilterNode';

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
    <aside className="mb-4 flex flex-col gap-2">
      {/* root */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
          selectedId === null
            ? 'border-(--border) bg-(--button-bg) font-medium'
            : 'border-(--border) text-(--text-muted) hover:bg-(--button-hover-bg)'
        }`}
      >
        <Folder size={14} />
        Все файлы
      </button>

      {/* tree */}
      <div className="flex flex-col">
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
      </div>
    </aside>
  );
}
