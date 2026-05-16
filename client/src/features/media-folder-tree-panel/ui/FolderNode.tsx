/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { MediaFolderTree } from '@/entities/media-folder';
import { IconButton } from '@/shared/ui/common';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';

import {
  Pencil1Icon,
  Cross1Icon,
  CheckIcon,
  ResetIcon,
} from '@radix-ui/react-icons';

import { useState } from 'react';

interface FolderNodeProps {
  node: MediaFolderTree;

  selectedId: number | null;

  renamingId: number | null;
  renameValue: string;

  depth?: number;

  onSelect: (id: number) => void;

  onStartRename: (node: MediaFolderTree) => void;
  onRenameValueChange: (value: string) => void;
  onRename: () => void;
  onCancelRename: () => void;

  onDelete: (id: number) => void;
}

export function FolderNode({
  node,
  selectedId,

  renamingId,
  renameValue,

  depth = 0,

  onSelect,

  onStartRename,
  onRenameValueChange,
  onRename,
  onCancelRename,

  onDelete,
}: FolderNodeProps) {
  const [expanded, setExpanded] = useState(false);

  const isSelected = selectedId === node.id;
  const isRenaming = renamingId === node.id;

  return (
    <div>
      <div
        className={`group flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-sm transition-colors ${
          isSelected ? 'bg-(--button-bg)' : 'hover:bg-(--button-hover-bg)'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(node.id)}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {node.children.length > 0 ? (
            <button
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();

                setExpanded((v) => !v);
              }}
            >
              {expanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          {expanded || isSelected ? (
            <FolderOpen size={14} className="shrink-0" />
          ) : (
            <Folder size={14} className="shrink-0" />
          )}

          {isRenaming ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => onRenameValueChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onRename();
                }

                if (e.key === 'Escape') {
                  onCancelRename();
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-max rounded-lg border border-(--border) bg-transparent px-2 ring-(--border) focus:outline-none"
              style={{
                width: `${Math.max(renameValue.length, 1) + 2}ch`,
              }}
            />
          ) : (
            <div className="truncate">{node.name}</div>
          )}
        </div>

        {isSelected && (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {isRenaming ? (
              <>
                <IconButton
                  onClick={onRename}
                  tooltip="Сохранить изменения"
                  icon={<CheckIcon className="h-4 w-4 cursor-pointer" />}
                />

                <IconButton
                  onClick={onCancelRename}
                  tooltip="Отменить редактирование"
                  icon={<ResetIcon className="h-4 w-4 cursor-pointer" />}
                />
              </>
            ) : (
              <>
                <IconButton
                  onClick={() => onStartRename(node)}
                  tooltip="Переименовать папку"
                  icon={<Pencil1Icon className="h-4 w-4 cursor-pointer" />}
                />

                <IconButton
                  onClick={() => onDelete(node.id)}
                  tooltip="Удалить папку"
                  icon={<Cross1Icon className="h-4 w-4 cursor-pointer" />}
                />
              </>
            )}
          </div>
        )}
      </div>

      {expanded &&
        node.children.map((child) => (
          <FolderNode
            key={child.id}
            node={child}
            selectedId={selectedId}
            renamingId={renamingId}
            renameValue={renameValue}
            onRenameValueChange={onRenameValueChange}
            onStartRename={onStartRename}
            onRename={onRename}
            onCancelRename={onCancelRename}
            onDelete={onDelete}
            onSelect={onSelect}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
