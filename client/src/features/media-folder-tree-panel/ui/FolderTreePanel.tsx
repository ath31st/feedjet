/** biome-ignore-all lint/a11y: disable all a11y rules */
import { Folder, X } from 'lucide-react';
import { FolderNode } from './FolderNode';
import { FolderCreateForm } from './FolderCreateForm';
import { useFolderTreePanel } from '../model/useFolderTreePanel';
import { IconButton } from '@/shared/ui/common';

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
    <aside
      className={`flex w-full shrink-0 flex-col gap-4 rounded-lg transition-all`}
    >
      {moveMode && (
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
      )}

      <div className="flex-1 overflow-y-auto">
        <div
          className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm transition-colors ${
            moveMode
              ? 'border border-(--border) border-dashed hover:bg-(--button-hover-bg)'
              : selectedFolderId === null
                ? 'bg-(--button-bg)'
                : 'hover:bg-(--button-hover-bg)'
          } ${isMovePending ? 'pointer-events-none opacity-50' : ''}`}
          onClick={() => handleSelect(null)}
        >
          <Folder size={14} className="shrink-0" />

          <span>Все файлы</span>
        </div>

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

        {!moveMode && <FolderCreateForm onCreate={handleCreateFolder} />}
      </div>

      {stats && !moveMode && (
        <p className="text-(--text-muted) text-xs">
          {stats.imageCount} изображений · {stats.videoCount} видео
        </p>
      )}
    </aside>
  );
}
