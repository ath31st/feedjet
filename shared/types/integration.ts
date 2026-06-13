export const integrationFull = [
  { type: 'fully_kiosk', label: 'Fully Kiosk' },
  { type: 'adb', label: 'ADB' },
  { type: 'philips_jointspace', label: 'Philips JointSpace' },
  { type: 'other', label: 'Другое' },
] as const;

export const integrationTypes = integrationFull.map((i) => i.type);
export type IntegrationType = (typeof integrationTypes)[number];

export type Integration = {
  id: number;
  type: IntegrationType;
  host: string;
  port: number;
  description: string | null;
  config: IntegrationConfig;
  isActive: boolean;
};

export type NewIntegration = {
  type: IntegrationType;
  host: string;
  port: number;
  description?: string;
  config: IntegrationConfig;
};

export type UpdateIntegration = {
  id: number;
  host?: string;
  port?: number;
  description?: string;
  config?: IntegrationConfig;
};

export type FullyKioskConfig = {
  login: string;
  password: string;
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
