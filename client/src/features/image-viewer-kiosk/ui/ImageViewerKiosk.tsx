import { useImageViewer } from '../model/useImageViewer';

interface ImageViewerKioskProps {
  onViewStart: () => void;
  onViewEnd: () => void;
  isSingleImageWidget: boolean;
}

export function ImageViewerKiosk({
  onViewStart,
  onViewEnd,
  isSingleImageWidget,
}: ImageViewerKioskProps) {
  const { currentImage, url } = useImageViewer({
    onViewEnd,
    isSingleImageWidget,
  });

  if (!currentImage || !url) {
    return null;
  }

  return (
    <img
      src={url}
      onLoad={onViewStart}
      className="relative z-10 h-full w-full object-contain"
      alt=""
    />
  );
}
