import type { MediaFile } from '@/entities/media-folder';
import { fmtBytes, fmtDuration } from '@/shared/lib';

export function buildMediaDescription(file: MediaFile) {
  return {
    name: file.name,
    format: file.format.toUpperCase(),
    resolution: `${file.width}×${file.height}`,
    size: fmtBytes(file.size),
    duration: file.kind === 'video' ? fmtDuration(file.duration) : null,
  };
}
