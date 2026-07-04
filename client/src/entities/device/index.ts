export * from './api/useDevice';
export * from '@shared/types/device';
export * from './model/deviceStore';
import type { DeviceFull as DeviceApi } from '@shared/types/device';

export type Device = Omit<DeviceApi, 'firstSeenAt' | 'lastSeenAt'> & {
  firstSeenAt: string;
  lastSeenAt: string;
};
