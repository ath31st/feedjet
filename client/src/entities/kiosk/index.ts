import type { Kiosk as KioskApi } from '@shared/types/kiosk';

export type { NewKiosk } from '@shared/types/kiosk';
export * from './api/useKiosk';
export * from './model/kioskStore';
export { useCurrentKiosk } from './lib/useCurrentKiosk';

export type Kiosk = Omit<KioskApi, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
}