export const integrationFull = [
  { type: 'fully_kiosk', label: 'Fully Kiosk' },
  { type: 'adb', label: 'ADB' },
  { type: 'philips_jointspace', label: 'Philips JointSpace' },
] as const;

export const integrationTypes = integrationFull.map((i) => i.type);
export type IntegrationType = (typeof integrationTypes)[number];

export type Integration = {
  id: number;
  type: IntegrationType;
  ip: string;
  port: number;
  description: string | null;
  config: IntegrationConfig;
  isActive: boolean;
};

type Base = {
  ip: string;
  port: number;
  description?: string;
};

export type NewIntegration =
  | ({
      type: 'fully_kiosk';
      config: FullyKioskConfig;
    } & Base)
  | ({
      type: 'adb';
      config: AdbConfig;
    } & Base)
  | ({
      type: 'philips_jointspace';
      config: PhilipsJointspaceConfig;
    } & Base);

type BaseUpdate = {
  id: number;
  ip?: string;
  port?: number;
  description?: string;
};

export type UpdateIntegration =
  | ({
      type: 'fully_kiosk';
      config?: FullyKioskConfig;
    } & BaseUpdate)
  | ({
      type: 'adb';
      config?: AdbConfig;
    } & BaseUpdate)
  | ({
      type: 'philips_jointspace';
      config?: PhilipsJointspaceConfig;
    } & BaseUpdate);

export type FullyKioskConfig = {
  login: string;
  password: string;
};

export type AdbConfig = Record<string, never>;

export type PhilipsJointspaceConfig = {
  deviceId: string;
  authKey: string;
};

export type IntegrationConfigMap = {
  fully_kiosk: FullyKioskConfig;
  adb: AdbConfig;
  philips_jointspace: PhilipsJointspaceConfig;
};

export type IntegrationConfig = IntegrationConfigMap[IntegrationType];
