export interface FeedConfig {
  id: number;
  cellsPerPage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewFeedConfig {
  cellsPerPage: number;
}

export interface UpdateFeedConfig {
  cellsPerPage?: number;
}
