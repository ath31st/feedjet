export interface FeedConfig {
  id: number;
  cellsPerPage: number;
  pagesCount: number;
  carouselIntervalMs: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewFeedConfig {
  cellsPerPage: number;
  pagesCount: number;
  carouselIntervalMs: number;
}

export interface UpdateFeedConfig {
  cellsPerPage?: number;
  pagesCount?: number;
  carouselIntervalMs?: number;
}
