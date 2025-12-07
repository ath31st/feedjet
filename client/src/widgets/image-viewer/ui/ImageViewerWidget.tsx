import { ImageViewerKiosk } from '@/features/image-viewer-kiosk';

interface ImageViewerWidgetProps {
  onViewStart: () => void;
  onViewEnd: () => void;
  isSingleImageWidget: boolean;
  displayDurationMs: number;
}

export function ImageViewerWidget({
  onViewStart,
  onViewEnd,
  isSingleImageWidget,
  displayDurationMs,
}: ImageViewerWidgetProps) {
  return (
    <div className="fixed inset-0 z-50">
      <ImageViewerKiosk
        onViewStart={onViewStart}
        onViewEnd={onViewEnd}
        isSingleImageWidget={isSingleImageWidget}
        displayDurationMs={displayDurationMs}
      />
    </div>
  );
}
