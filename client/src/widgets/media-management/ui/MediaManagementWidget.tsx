import { useState } from 'react';
import type { MediaFile } from '@/entities/media-folder';
import { FolderTreePanel } from '@/features/media-folder-tree-panel';
import { MediaGrid } from '@/features/media-grid';
import { SettingsCard } from '@/shared/ui';
import { MediaBreadcrumbs } from '@/features/media-breadcrumbs';
import { MediaUploadButton } from '@/features/media-upload-button';
import { buildImageUrl } from '@/entities/image';
import { buildVideoUrl } from '@/entities/video';
import { buildMediaDescription } from '@/features/preview-modal';
import { PreviewModal } from '@/features/preview-modal';

export function MediaManagementWidget() {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(
    () => new Set(),
  );
  const [preview, setPreview] = useState<MediaFile | null>(null);

  return (
    <div className="flex w-full flex-row gap-6">
      <SettingsCard title="Папки" className="w-full md:w-1/5">
        <FolderTreePanel
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
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
