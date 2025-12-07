import { useImageViewer } from '../model/useImageViewer';

interface ImageViewerKioskProps {
  onViewStart: () => void;
  onViewEnd: () => void;
  isSingleImageWidget: boolean;
  displayDurationMs: number;
}

export function ImageViewerKiosk({
  onViewStart,
  onViewEnd,
  isSingleImageWidget,
  displayDurationMs,
}: ImageViewerKioskProps) {
  const { currentImage, url } = useImageViewer({
    onViewStart,
    onViewEnd,
    isSingleImageWidget,
    displayDurationMs,
  });

  if (!currentImage || !url) {
    return null;
  }

  return (
    <img
      src={url}
      className="relative z-10 h-full w-full object-contain"
      alt=""
    />
  );
}
