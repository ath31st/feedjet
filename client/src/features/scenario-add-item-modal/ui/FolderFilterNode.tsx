import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import type { MediaFolderTree } from '@/entities/media-folder';

interface Props {
  node: MediaFolderTree;
  selectedId: number | null;
  onSelect: (id: number) => void;

  expandedIds: Set<number>;
  toggle: (id: number) => void;

  depth?: number;
}

export function FolderFilterNode({
  node,
  selectedId,
  onSelect,
  expandedIds,
  toggle,
  depth = 0,
}: Props) {
  const expanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={`group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition-colors ${
          isSelected
            ? 'bg-(--button-bg) font-medium'
            : 'text-(--text-muted) hover:bg-(--button-hover-bg)'
        }`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        <button
          type="button"
          className="shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            toggle(node.id);
          }}
        >
          {node.children.length > 0 ? (
            expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span className="w-3.5" />
          )}
        </button>

        {expanded ? <FolderOpen size={14} /> : <Folder size={14} />}

        <span className="truncate">{node.name}</span>
      </button>

      {expanded &&
        node.children.map((child) => (
          <FolderFilterNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            onSelect={onSelect}
            expandedIds={expandedIds}
            toggle={toggle}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
