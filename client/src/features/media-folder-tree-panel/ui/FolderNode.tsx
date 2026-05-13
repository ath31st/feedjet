/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { MediaFolderTree } from '@/entities/media-folder';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface FolderNodeProps {
  node: MediaFolderTree;
  selectedId: number | null;
  onSelect: (id: number) => void;
  depth?: number;
  onContextMenu: (e: React.MouseEvent, node: MediaFolderTree) => void;
}

export function FolderNode({
  node,
  selectedId,
  onSelect,
  depth = 0,
  onContextMenu,
}: FolderNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm transition-colors ${isSelected ? 'bg-(--button-bg)' : 'hover:bg-(--button-hover-bg)'}`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(node.id)}
        onContextMenu={(e) => onContextMenu(e, node)}
      >
        {node.children.length > 0 ? (
          <button
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {expanded || isSelected ? (
          <FolderOpen size={14} className="shrink-0" />
        ) : (
          <Folder size={14} className="shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {expanded &&
        node.children.map((child) => (
          <FolderNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            onSelect={onSelect}
            depth={depth + 1}
            onContextMenu={onContextMenu}
          />
        ))}
    </div>
  );
}
