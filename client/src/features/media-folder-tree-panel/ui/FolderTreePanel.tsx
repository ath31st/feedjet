/** biome-ignore-all lint/a11y: disable all a11y rules */
import { X } from 'lucide-react';
import { FolderNode } from './FolderNode';
import { FolderCreateForm } from './FolderCreateForm';
import { useFolderTreePanel } from '../model/useFolderTreePanel';
import { IconButton } from '@/shared/ui/common';
import { FolderTreeItem, FolderTreeContainer } from '@/shared/ui';

interface FolderTreePanelProps {
  selectedFolderId: number | null;
  onSelectFolder: (id: number | null) => void;
  moveMode?: boolean;
  moveCount?: number;
  onPickTargetFolder?: (folderId: number | null) => void;
  onCancelMove?: () => void;
  isMovePending?: boolean;
}

export function FolderTreePanel({
  selectedFolderId,
  onSelectFolder,
  moveMode = false,
  moveCount = 0,
  onPickTargetFolder,
  onCancelMove,
  isMovePending = false,
}: FolderTreePanelProps) {
  const {
    tree,
    stats,
    renamingId,
    renameValue,
    handleCancelRename,
    handleCreateFolder,
    handleDelete,
    handleRename,
    handleStartRename,
    setRenameValue,
    handleSelect,
  } = useFolderTreePanel(
    selectedFolderId,
    onSelectFolder,
    onPickTargetFolder,
    moveMode,
    isMovePending,
  );

  return (
    <FolderTreeContainer
      header={
        moveMode && (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-(--button-bg) p-2 text-sm">
            <span>
              Куда переместить {moveCount}{' '}
              {moveCount === 1
                ? 'файл'
                : moveCount >= 2 && moveCount <= 4
                  ? 'файла'
                  : 'файлов'}
              ?
            </span>
            <IconButton
              tooltip="Отменить перемещение"
              icon={<X size={16} />}
              onClick={() => onCancelMove?.()}
            />
          </div>
        )
      }
      rootRow={
        <FolderTreeItem
          name="Все файлы"
          isSelected={selectedFolderId === null}
          moveMode={moveMode}
          isMovePending={isMovePending}
          onClick={() => handleSelect(null)}
        />
      }
      bodyFooter={
        !moveMode && <FolderCreateForm onCreate={handleCreateFolder} />
      }
      asideFooter={
        stats &&
        !moveMode && (
          <p className="text-(--text-muted) text-xs">
            {stats.imageCount} изображений · {stats.videoCount} видео
          </p>
        )
      }
    >
      {tree.map((node) => (
        <FolderNode
          key={node.id}
          node={node}
          selectedId={selectedFolderId}
          renamingId={renamingId}
          renameValue={renameValue}
          onRenameValueChange={setRenameValue}
          onStartRename={handleStartRename}
          onRename={handleRename}
          onCancelRename={handleCancelRename}
          onDelete={handleDelete}
          onSelect={(id) => handleSelect(id)}
          moveMode={moveMode}
          isMovePending={isMovePending}
        />
      ))}
    </FolderTreeContainer>
  );
}
