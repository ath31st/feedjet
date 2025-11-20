export interface KioskHeartbeat {
  kioskId: number;
  slug: string;
  ip: string;
  lastHeartbeat: Date;
}
