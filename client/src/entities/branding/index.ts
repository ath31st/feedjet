export * from '@shared/types/branding.config';
export * from './api/useBranding';
export * from './model/brandingConfigStore';
export * from './api/useLogo';
export * from './lib/buildLogoUrl';

import type { BrandingConfig as BrandingConfigApi } from '@shared/types/branding.config';
export type BrandingConfig = Omit<
  BrandingConfigApi,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string;
  updatedAt: string;
};
