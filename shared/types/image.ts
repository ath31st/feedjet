export interface ImageMetadata {
  name: string;
  fileName: string;
  width: number;
  height: number;
  format: string;
  size: number;
  createdAt: number;
  thumbnail: string;
  mtime: number;
}

export interface AdminImageInfo extends ImageMetadata {
  isActive: boolean | null;
  order: number | null;
  durationSeconds: number | null;
}

export interface KioskImageInfo extends ImageMetadata {
  isActive: boolean;
  order: number;
  durationSeconds: number;
}

export interface ImageOrderUpdate {
  fileName: string;
  order: number;
}

export interface ImageDurationUpdate {
  fileName: string;
  durationSeconds: number;
}
