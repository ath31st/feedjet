export * from './api/useDevice';
export * from '@shared/types/device';
export * from './model/deviceStore';
import type { DeviceWithIntegration as DeviceApi } from '@shared/types/device';

export type Device = Omit<DeviceApi, 'firstSeenAt' | 'lastSeenAt'> & {
  firstSeenAt: string;
  lastSeenAt: string;
};
