import type { MediaFolderTree } from '@/entities/media-folder';
import { FolderTreeItem } from '@/shared/ui';

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
    <FolderTreeItem
      name={node.name}
      depth={depth}
      isSelected={isSelected}
      isExpanded={expanded}
      hasChildren={node.children.length > 0}
      onToggleExpand={() => toggle(node.id)}
      onClick={() => onSelect(node.id)}
    >
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
    </FolderTreeItem>
  );
}
