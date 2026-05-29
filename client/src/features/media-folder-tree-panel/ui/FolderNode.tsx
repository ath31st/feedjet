/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { MediaFolderTree } from '@/entities/media-folder';
import { IconButton } from '@/shared/ui/common';
import {
  Pencil1Icon,
  Cross1Icon,
  CheckIcon,
  ResetIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { ConfirmActionDialog, FolderTreeItem } from '@/shared/ui';

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
  moveMode?: boolean;
  isMovePending?: boolean;
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
  moveMode = false,
  isMovePending = false,
}: FolderNodeProps) {
  const [expanded, setExpanded] = useState(false);

  const isSelected = selectedId === node.id;
  const isRenaming = renamingId === node.id;

  return (
    <FolderTreeItem
      name={node.name}
      depth={depth}
      isSelected={isSelected}
      isExpanded={expanded}
      hasChildren={node.children.length > 0}
      moveMode={moveMode}
      isMovePending={isMovePending}
      onToggleExpand={() => setExpanded((v) => !v)}
      onClick={() => onSelect(node.id)}
      renderTitle={() =>
        isRenaming && !moveMode ? (
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => onRenameValueChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onRename();
              if (e.key === 'Escape') onCancelRename();
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-max rounded-lg border border-(--border) bg-transparent px-2 ring-(--border) focus:outline-none"
            style={{ width: `${Math.max(renameValue.length, 1) + 2}ch` }}
          />
        ) : (
          <div className="truncate">{node.name}</div>
        )
      }
      renderActions={() =>
        isSelected && !moveMode ? (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {isRenaming ? (
              <>
                <IconButton
                  onClick={onRename}
                  tooltip="Сохранить изменения"
                  icon={<CheckIcon className="h-4 w-4" />}
                />
                <IconButton
                  onClick={onCancelRename}
                  tooltip="Отменить редактирование"
                  icon={<ResetIcon className="h-4 w-4" />}
                />
              </>
            ) : (
              <>
                <IconButton
                  onClick={() => onStartRename(node)}
                  tooltip="Переименовать папку"
                  icon={<Pencil1Icon className="h-4 w-4" />}
                />
                <ConfirmActionDialog
                  title="Удаление папки"
                  onConfirm={() => onDelete(node.id)}
                  description={`Вы действительно хотите удалить папку "${node.name}"? Содержимое папки НЕ будет удалено и будет доступно в корневой папке.`}
                  trigger={
                    <IconButton
                      tooltip="Удалить папку"
                      icon={<Cross1Icon className="h-4 w-4" />}
                    />
                  }
                />
              </>
            )}
          </div>
        ) : null
      }
    >
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
            moveMode={moveMode}
            isMovePending={isMovePending}
          />
        ))}
    </FolderTreeItem>
  );
}
