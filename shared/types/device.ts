export interface Device {
  deviceId: string;
  ip: string;
  slug: string;
  userAgent: string;
  platform?: string | null;
  firstSeenAt: Date;
  lastSeenAt: Date;
}

export type DeviceUpsertPayload = {
  deviceId: string;
  slug: string;
  userAgent: string;
  platform?: string;
};

export type DeviceFull = Device & { hasIntegration: boolean };
