import type { MediaFile } from '@shared/types/media.folder';

export function mediaFileKey(file: Pick<MediaFile, 'kind' | 'id'>): string {
  return `${file.kind}-${file.id}`;
}

export function toggleMediaSelectionKey(
  prev: Set<string>,
  key: string,
): Set<string> {
  const next = new Set(prev);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export function splitSelectionKeys(keys: Set<string>): {
  imageIds: number[];
  videoIds: number[];
} {
  const imageIds: number[] = [];
  const videoIds: number[] = [];

  for (const key of keys) {
    const [kind, idStr] = key.split('-');
    const id = Number(idStr);

    if (!Number.isFinite(id)) continue;

    if (kind === 'image') {
      imageIds.push(id);
    } else if (kind === 'video') {
      videoIds.push(id);
    }
  }

  return { imageIds, videoIds };
}
