export interface MediaFolder {
  id: number;
  name: string;
  parentId: number | null;
  createdAt: number;
}

export interface MediaFolderTree extends MediaFolder {
  children: MediaFolderTree[];
}

export interface MediaFileBase {
  id: number;
  name: string;
  fileName: string;
  format: string;
  width: number;
  height: number;
  size: number;
  folderId: number | null;
  createdAt: number;
  updatedAt: number;
  mtime: number;
}

export interface MediaImage extends MediaFileBase {
  kind: 'image';
  thumbnail: string;
}

export interface MediaVideo extends MediaFileBase {
  kind: 'video';
  duration: number;
}

export type MediaFile = MediaImage | MediaVideo;
