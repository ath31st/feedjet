export interface Organization {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewOrganization {
  name: string;
  slug: string;
}

export interface UpdateOrganization {
  name?: string;
  slug?: string;
}
