/** biome-ignore-all lint/a11y: disable all a11y rules */
import { useState, useRef } from 'react';
import { useMediaFolderTree } from '@/entities/media-folder';
import type { MediaFile } from '@/entities/media-folder';
import { ChevronRight, FolderIcon, Upload } from 'lucide-react';
import { CommonButton } from '@/shared/ui/common';
import { FolderTreePanel } from '@/features/media-folder-tree-panel';
import { MediaPreviewModal } from '@/features/media-preview-modal';
import { MediaGrid } from '@/features/media-grid';
import { useMediaUpload } from '../model/useMediaUpload';
import { buildBreadcrumbs } from '../model/useBuildBreadcrumbs';
import { SettingsCard } from '@/shared/ui';

export function MediaManagementWidget() {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(
    () => new Set(),
  );
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: tree = [] } = useMediaFolderTree();
  const { uploading, handleUploadFiles } = useMediaUpload({
    folderId: selectedFolderId,
  });
  const breadcrumbs = buildBreadcrumbs(tree, selectedFolderId);

  return (
    <div className="flex w-full flex-row gap-6">
      <SettingsCard title="Папки" className="w-full md:w-1/5">
        <FolderTreePanel
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />
      </SettingsCard>

      <SettingsCard title="Управление медиа" className="w-full md:w-4/5">
        <div className="flex h-full flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2">
              <nav className="flex flex-1 items-center gap-1 text-sm">
                <button
                  className="cursor-pointer hover:text-(--button-hover-bg)"
                  onClick={() => setSelectedFolderId(null)}
                >
                  <div className="flex flex-row items-center gap-1">
                    <FolderIcon size={24} />
                    <span>:</span>
                  </div>
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
      </SettingsCard>
    </div>
  );
}
