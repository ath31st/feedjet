import type { MediaFolderTree } from '@/entities/media-folder';
import { useExpandedFolderIds } from '@/entities/media-folder';
import { FolderFilterNode } from './FolderFilterNode';
import { FolderTreeItem, FolderTreeContainer } from '@/shared/ui';

interface Props {
  tree: MediaFolderTree[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function FolderFilterTree({ tree, selectedId, onSelect }: Props) {
  const { expandedIds, toggleExpand } = useExpandedFolderIds(tree, selectedId);

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
          toggle={toggleExpand}
          depth={0}
        />
      ))}
    </FolderTreeContainer>
  );
}
