export interface BaseImageMetadata {
  name: string;
  fileName: string;
  format: string;
  width: number;
  height: number;
  size: number;
  createdAt: number;
  mtime: number;
}

export interface ImageMetadata extends BaseImageMetadata {
  thumbnail: string;
}
