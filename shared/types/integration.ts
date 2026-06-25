export const integrationFull = [
  {
    type: 'fully_kiosk',
    label: 'Fully Kiosk',
    defaultPort: 2323,
  },
  {
    type: 'adb',
    label: 'ADB',
    defaultPort: 5555,
  },
  {
    type: 'philips_jointspace',
    label: 'Philips JointSpace',
    defaultPort: 1926,
  },
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

export type UpdateIntegration = {
  id: number;
  ip?: string;
  port?: number;
  description?: string;
  config?: unknown;
};

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
