export interface RssFeed {
  id: number;
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewRssFeed {
  url: string;
}

export interface UpdateRssFeed {
  url?: string;
  isActive?: boolean;
}
