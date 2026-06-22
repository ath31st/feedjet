export interface Device {
  deviceId: string;
  ip: string;
  userAgent: string;
  platform?: string | null;
  firstSeenAt: Date;
  lastSeenAt: Date;
}

export type DeviceUpsertPayload = {
  deviceId: string;
  userAgent: string;
  platform?: string;
};
