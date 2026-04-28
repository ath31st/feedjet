import { ImageViewerKiosk } from '@/features/image-viewer-kiosk';

interface ImageViewerWidgetProps {
  onViewStart: () => void;
  onViewEnd: () => void;
  isSingleImageWidget: boolean;
}

export function ImageViewerWidget({
  onViewStart,
  onViewEnd,
  isSingleImageWidget,
}: ImageViewerWidgetProps) {
  return (
    <div className="fixed inset-0 z-50">
      <ImageViewerKiosk
        onViewStart={onViewStart}
        onViewEnd={onViewEnd}
        isSingleImageWidget={isSingleImageWidget}
      />
    </div>
  );
}
