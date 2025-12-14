export interface VideoMetadata {
  name: string;
  fileName: string;
  format: string;
  duration: number;
  width: number;
  height: number;
  size: number;
  mtime: number;
  createdAt: number;
}

export interface AdminVideoInfo extends VideoMetadata {
  isActive: boolean | null;
  order: number | null;
}

export interface KioskVideoInfo extends VideoMetadata {
  isActive: boolean;
  order: number;
}

export interface VideoOrderUpdate {
  fileName: string;
  order: number;
}
