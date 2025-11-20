import type { Kiosk as KioskApi } from '@shared/types/kiosk';
import type { KioskHeartbeat as KioskHeartbeatApi } from '@shared/types/kiosk.heartbeat';

export type { NewKiosk } from '@shared/types/kiosk';
export * from './api/useKiosk';
export * from './model/kioskStore';
export { useCurrentKiosk } from './lib/useCurrentKiosk';

export type Kiosk = Omit<KioskApi, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

type KioskHeartbeat = Omit<KioskHeartbeatApi, 'lastHeartbeat'> & {
  lastHeartbeat: string;
};

export type KioskWithHeartbeats = Kiosk & { heartbeats: KioskHeartbeat[] };
