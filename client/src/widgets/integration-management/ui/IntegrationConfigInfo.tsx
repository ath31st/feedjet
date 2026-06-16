import type {
  AdbConfig,
  FullyKioskConfig,
  Integration,
  PhilipsJointspaceConfig,
} from '@/entities/integration';

type Props = {
  integration: Integration;
};

export function IntegrationConfigInfo({ integration }: Props) {
  switch (integration.type) {
    case 'fully_kiosk':
      return <p>Логин: {(integration.config as FullyKioskConfig).login}</p>;

    case 'adb':
      return (
        <p>
          ADB порт: {(integration.config as AdbConfig).port ?? integration.port}
        </p>
      );

    case 'philips_jointspace':
      return (
        <p>
          Device ID: {(integration.config as PhilipsJointspaceConfig).deviceId}
        </p>
      );

    case 'other':
      return null;
  }
}
