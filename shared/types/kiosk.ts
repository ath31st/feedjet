export interface Kiosk {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  isActive: boolean;
  //  createdAt: Date;
  //  updatedAt: Date;
}

export interface NewKiosk {
  name: string;
  slug: string;
  description?: string;
  location?: string;
}
