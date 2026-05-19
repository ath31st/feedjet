import { FolderTreePanel } from '@/features/media-folder-tree-panel';
import { MediaGrid } from '@/features/media-grid';
import { SettingsCard } from '@/shared/ui';
import { MediaBreadcrumbs } from '@/features/media-breadcrumbs';
import { MediaUploadButton } from '@/features/media-upload-button';
import { buildImageUrl } from '@/entities/image';
import { buildVideoUrl } from '@/entities/video';
import { buildMediaDescription } from '@/features/preview-modal';
import { PreviewModal } from '@/features/preview-modal';
import { useMediaManagementWidget } from '../model/useMediaManagementWidget';

export function MediaManagementWidget() {
  const {
    preview,
    setPreview,
    handlePickTargetFolder,
    handleStartMove,
    handleCancelMove,
    selectedFolderId,
    setSelectedFolderId,
    selectionTotal,
    moveMode,
    isMoving,
    selectedFiles,
    setSelectedFiles,
  } = useMediaManagementWidget();

  return (
    <div className="flex w-full flex-row gap-6">
      <SettingsCard title="Папки" className="w-full md:w-1/5">
        <FolderTreePanel
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          moveMode={moveMode}
          moveCount={selectionTotal}
          onPickTargetFolder={handlePickTargetFolder}
          onCancelMove={handleCancelMove}
          isMovePending={isMoving}
        />
      </SettingsCard>

      <SettingsCard title="Управление медиа" className="w-full md:w-4/5">
        <div className="flex items-center p-2">
          <MediaBreadcrumbs
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
          />

          <MediaUploadButton selectedFolderId={selectedFolderId} />
        </div>

        <MediaGrid
          selectedFolderId={selectedFolderId}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          onToggleSelect={(key) => {
            setSelectedFiles((prev) => {
              const next = new Set(prev);

              if (next.has(key)) {
                next.delete(key);
              } else {
                next.add(key);
              }

              return next;
            });
          }}
          onPreview={setPreview}
          onStartMove={handleStartMove}
          moveMode={moveMode}
        />

        {preview && (
          <PreviewModal
            open={!!preview}
            kind={preview.kind}
            src={
              preview?.kind === 'image'
                ? buildImageUrl(preview.fileName)
                : buildVideoUrl(preview.fileName)
            }
            alt={preview.name}
            videoMuted
            onClose={() => setPreview(null)}
            description={buildMediaDescription(preview)}
          />
        )}
      </SettingsCard>
    </div>
  );
}
