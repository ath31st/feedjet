export const integrationFull = [
  { type: 'fully_kiosk', label: 'Fully Kiosk' },
  { type: 'adb', label: 'ADB' },
  { type: 'philips_jointspace', label: 'Philips JointSpace' },
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

export type FullyKioskConfig = {
  login: string;
  passwordEnc: string;
};

export type AdbConfig = {
  port?: number;
};

export type PhilipsJointspaceConfig = {
  deviceId: string;
  authKey: string;
};

export type OtherIntegrationConfig = Record<string, unknown>;

export type IntegrationConfigMap = {
  fully_kiosk: FullyKioskConfig;
  adb: AdbConfig;
  philips_jointspace: PhilipsJointspaceConfig;
  other: OtherIntegrationConfig;
};

export type IntegrationConfig = IntegrationConfigMap[IntegrationType];
