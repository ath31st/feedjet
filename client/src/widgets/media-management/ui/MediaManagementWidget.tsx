/** biome-ignore-all lint/a11y: disable all a11y rules */
import { useState, useCallback, useRef } from 'react';
import { useMediaFolderTree } from '@/entities/media-folder';
import type { MediaFile } from '@/entities/media-folder';
import { ChevronRight, Upload } from 'lucide-react';
import { CommonButton } from '@/shared/ui/common';
import { FolderTreePanel } from '@/features/media-folder-tree-panel';
import { MediaPreviewModal } from '@/features/media-preview-modal';
import { MediaGrid } from '@/features/media-grid';
import { useMediaUpload } from '../model/useMediaUpload';
import { UploadOverlay } from './UploadOverlay';
import { buildBreadcrumbs } from '../model/useBuildBreadcrumbs';
import { SettingsCard } from '@/shared/ui';

export function MediaManagementWidget() {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(
    () => new Set(),
  );
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: tree = [] } = useMediaFolderTree();
  const { uploading, handleUploadFiles } = useMediaUpload({
    folderId: selectedFolderId,
  });

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      void handleUploadFiles(e.dataTransfer.files);
    },
    [handleUploadFiles],
  );

  const breadcrumbs = buildBreadcrumbs(tree, selectedFolderId);

  return (
    <SettingsCard title="Управление медиа">
      <div
        className="flex h-full flex-col overflow-hidden"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <UploadOverlay visible={isDragOver} />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) =>
            e.target.files && void handleUploadFiles(e.target.files)
          }
        />

        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <FolderTreePanel
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
          />

          {/* Main */}
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2">
              <nav className="flex flex-1 items-center gap-1 text-sm">
                <button
                  className="cursor-pointer hover:text-(--button-hover-bg)"
                  onClick={() => setSelectedFolderId(null)}
                >
                  Медиа
                </button>
                {breadcrumbs.map((crumb) => (
                  <span key={crumb.id} className="flex items-center gap-1">
                    <ChevronRight size={14} />
                    <button
                      className="cursor-pointer hover:text-(--button-hover-bg)"
                      onClick={() => setSelectedFolderId(crumb.id)}
                    >
                      {crumb.name}
                    </button>
                  </span>
                ))}
              </nav>

              <CommonButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-row items-center gap-2">
                  <Upload size={14} />
                  <span className="text-xs">Загрузить</span>
                </div>
              </CommonButton>
            </div>

            {uploading.length > 0 && (
              <div className="px-4 py-2">
                {uploading.map((u) => (
                  <div
                    key={u.name}
                    className="mb-1 flex items-center gap-2 text-sm"
                  >
                    <span className="flex-1 truncate">{u.name}</span>
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-(--border)">
                      <div
                        className="h-full transition-all"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs">
                      {u.progress}%
                    </span>
                  </div>
                ))}
              </div>
            )}

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
          </main>
        </div>

        <MediaPreviewModal file={preview} onClose={() => setPreview(null)} />
      </div>
    </SettingsCard>
  );
}
