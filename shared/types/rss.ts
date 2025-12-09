export interface RssFeed {
  id: number;
  url: string;
  name: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewRssFeed {
  url: string;
  name?: string;
}

export interface UpdateRssFeed {
  url?: string;
  name?: string;
  isActive?: boolean;
}
