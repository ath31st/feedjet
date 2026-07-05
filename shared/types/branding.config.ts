export interface BrandingConfig {
  id: number;
  organizationName: string;
  scheduleHeaderTitle: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandingConfigUpdate {
  organizationName?: string;
  scheduleHeaderTitle?: string;
}
