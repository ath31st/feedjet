/** biome-ignore-all lint/a11y: disable all a11y rules */
import { FolderTreePanel } from '@/features/media-folder-tree-panel';
import {
  ConfirmActionDialog,
  MediaGrid,
  MediaSelectionToolbar,
  SettingsCard,
} from '@/shared/ui';
import {
  MediaDropZone,
  MediaUploadArea,
  MediaUploadButton,
} from '@/features/media-upload-button';
import { buildImageUrl } from '@/entities/image';
import { buildPdfUrl } from '@/entities/pdf';
import { buildVideoUrl } from '@/entities/video';
import { buildMediaDescription } from '@/features/preview-modal';
import { PreviewModal } from '@/features/preview-modal';
import { useMediaManagementWidget } from '../model/useMediaManagementWidget';
import { DiskUsageInfo } from '@/features/disk-usage-info';
import { IconButton } from '@/shared/ui/common';
import { Eye, Trash2 } from 'lucide-react';

export function MediaManagementWidget() {
  const {
    media,
    isLoading,
    childFolders,

    preview,
    handleOpenPreview,
    handleClosePreview,

    selectedFolderId,
    handleSelectFolder,

    selectedFiles,
    handleToggleSelect,
    handleClearSelection,

    selectionTotal,

    moveMode,
    isMoving,

    handleDelete,
    handleBulkDelete,
    handleStartMove,
    handleCancelMove,
    handlePickTargetFolder,
  } = useMediaManagementWidget();

  return (
    <div className="flex w-full flex-row gap-6">
      <SettingsCard title="Папки" className="w-full md:w-1/5">
        <div className="flex flex-col gap-6">
          <FolderTreePanel
            selectedFolderId={selectedFolderId}
            onSelectFolder={handleSelectFolder}
            moveMode={moveMode}
            moveCount={selectionTotal}
            onPickTargetFolder={handlePickTargetFolder}
            onCancelMove={handleCancelMove}
            isMovePending={isMoving}
          />

          <DiskUsageInfo />
        </div>
      </SettingsCard>

      <SettingsCard title="Управление медиа" className="w-full md:w-4/5">
        <MediaUploadArea folderId={selectedFolderId}>
          <div className="relative flex items-center justify-end gap-2 overflow-hidden p-2">
            <MediaUploadButton />

            <div
              className={`absolute right-0 flex items-center gap-2 transition-all duration-300 ease-in-out ${
                selectedFiles.size > 0
                  ? 'translate-x-0 opacity-100'
                  : 'pointer-events-none translate-x-full opacity-0'
              }`}
            >
              <MediaSelectionToolbar
                selectedCount={selectedFiles.size}
                mode="manage"
                moveMode={moveMode}
                onStartMove={handleStartMove}
                onBulkDelete={handleBulkDelete}
                onClearSelection={handleClearSelection}
              />
            </div>
          </div>

          <MediaDropZone>
            <MediaGrid
              media={media}
              isLoading={isLoading}
              folders={childFolders}
              onOpenFolder={handleSelectFolder}
              selectedFiles={selectedFiles}
              onToggleSelect={handleToggleSelect}
              renderActions={(file) => (
                <>
                  <IconButton
                    icon={<Eye size={22} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPreview(file);
                    }}
                  />

                  <ConfirmActionDialog
                    confirmText="Удалить"
                    description={`Файл «${file.name}» будет удалён`}
                    trigger={<IconButton icon={<Trash2 size={22} />} />}
                    title="Удалить файл?"
                    onConfirm={(e) => {
                      e.stopPropagation();
                      handleDelete(file);
                    }}
                  />
                </>
              )}
            />
          </MediaDropZone>
        </MediaUploadArea>

        {preview && (
          <PreviewModal
            open={!!preview}
            kind={preview.kind === 'video' ? 'video' : 'image'}
            src={
              preview.kind === 'image'
                ? buildImageUrl(preview.fileName)
                : preview.kind === 'video'
                  ? buildVideoUrl(preview.fileName)
                  : buildPdfUrl(preview.thumbnail || preview.fileName)
            }
            alt={preview.name}
            videoMuted
            onClose={handleClosePreview}
            description={buildMediaDescription(preview)}
          />
        )}
      </SettingsCard>
    </div>
  );
}
