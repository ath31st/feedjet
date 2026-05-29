/** biome-ignore-all lint/a11y: disable all a11y rules */
import type React from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';

interface FolderTreeItemProps {
  name: string;
  depth?: number;
  isSelected?: boolean;
  isExpanded?: boolean;
  hasChildren?: boolean;
  moveMode?: boolean;
  isMovePending?: boolean;
  onClick?: () => void;
  onToggleExpand?: (e: React.MouseEvent) => void;
  renderTitle?: () => React.ReactNode;
  renderActions?: () => React.ReactNode;
  children?: React.ReactNode;
}

export function FolderTreeItem({
  name,
  depth = 0,
  isSelected = false,
  isExpanded = false,
  hasChildren = false,
  moveMode = false,
  isMovePending = false,
  onClick,
  onToggleExpand,
  renderTitle,
  renderActions,
  children,
}: FolderTreeItemProps) {
  const baseBackground = isSelected
    ? 'bg-(--button-bg)'
    : 'hover:bg-(--button-hover-bg)';

  const rowClass = moveMode
    ? `border border-(--border) border-dashed ${baseBackground} ${
        isMovePending ? 'pointer-events-none opacity-50' : ''
      }`
    : baseBackground;

  return (
    <div>
      <div
        className={`group flex cursor-pointer items-center justify-between rounded-lg p-2 text-sm transition-colors ${rowClass}`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={onClick}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            className="shrink-0 cursor-pointer disabled:cursor-default"
            disabled={!hasChildren}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand?.(e);
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )
            ) : (
              <span className="block w-3.5" />
            )}
          </button>

          {isExpanded || (isSelected && !moveMode) ? (
            <FolderOpen size={14} className="shrink-0" />
          ) : (
            <Folder size={14} className="shrink-0" />
          )}

          {renderTitle ? (
            renderTitle()
          ) : (
            <span className="truncate">{name}</span>
          )}
        </div>

        {renderActions?.()}
      </div>

      {children}
    </div>
  );
}
