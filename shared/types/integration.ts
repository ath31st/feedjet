export const integrationFull = [
  { type: 'fully_kiosk', label: 'Fully Kiosk' },
  { type: 'adb', label: 'ADB' },
  { type: 'other', label: 'Другое' },
] as const;

export const integrationTypes = integrationFull.map((i) => i.type);
export type IntegrationType = (typeof integrationTypes)[number];

export interface Integration {
  kioskId: number;
  type: IntegrationType;
  description?: string;
  login?: string;
  passwordEnc?: string;
}

export interface NewIntegration {
  type: IntegrationType;
  description?: string;
  login?: string;
  password?: string;
}

export interface UpdateIntegration {
  type: IntegrationType;
  description?: string;
  login?: string;
  password?: string;
}
