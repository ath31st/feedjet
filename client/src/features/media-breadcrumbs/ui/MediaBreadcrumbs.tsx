/** biome-ignore-all lint/a11y: disable all a11y rules */
import { ChevronRight, FolderIcon } from 'lucide-react';
import { buildBreadcrumbs } from '../model/useBuildBreadcrumbs';
import { useMediaFolderTree } from '@/entities/media-folder';

interface MediaBreadcrumbsProps {
  selectedFolderId: number | null;
  onSelect: (id: number | null) => void;
}

export function MediaBreadcrumbs({
  selectedFolderId,
  onSelect,
}: MediaBreadcrumbsProps) {
  const { data: tree = [] } = useMediaFolderTree();
  const breadcrumbs = buildBreadcrumbs(tree, selectedFolderId);

  return (
    <nav className="flex flex-1 items-center gap-1 text-sm">
      <button
        className="cursor-pointer hover:text-(--button-hover-bg)"
        onClick={() => onSelect(null)}
      >
        <div className="flex flex-row items-center gap-1">
          <FolderIcon size={24} />
          <span>:</span>
        </div>
      </button>
      {breadcrumbs.map((item) => (
        <span key={item.id} className="flex items-center gap-1">
          <ChevronRight size={14} />
          <button
            className="cursor-pointer hover:text-(--button-hover-bg)"
            onClick={() => onSelect(item.id)}
          >
            {item.name}
          </button>
        </span>
      ))}
    </nav>
  );
}
