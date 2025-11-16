import { useBackgroundManager } from '../model/useBackgroundManager';
import { BackgroundGrid } from './BackgroundGrid';
import { HiddenFileInput } from './HiddenFileInput';
import { BackgroundPreviewDialog } from './BackgroundPreviewDialog';

export function ManageBirthdayBackground() {
  const {
    backgrounds,
    isLoading,
    previewMonth,
    fileInputRef,
    handleSlotClick,
    handleUpload,
    handleReplace,
    handleDelete,
    closePreview,
  } = useBackgroundManager();

  if (isLoading) {
    return <div className="text-sm opacity-50">Загрузка…</div>;
  }

  return (
    <>
      {backgrounds && (
        <BackgroundGrid
          backgrounds={backgrounds}
          onSlotClick={handleSlotClick}
        />
      )}

      <HiddenFileInput ref={fileInputRef} onChange={handleUpload} />

      <BackgroundPreviewDialog
        open={previewMonth !== null}
        onOpenChange={closePreview}
        backgrounds={backgrounds || []}
        previewMonth={previewMonth}
        onDelete={handleDelete}
        onReplace={handleReplace}
      />
    </>
  );
}
