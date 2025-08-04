export interface FeedConfig {
  id: number;
  visibleCellCount: number;
  carouselSize: number;
  carouselIntervalMs: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewFeedConfig {
  visibleCellCount: number;
  carouselSize: number;
  carouselIntervalMs: number;
}

export interface UpdateFeedConfig {
  visibleCellCount?: number;
  carouselSize?: number;
  carouselIntervalMs?: number;
}
