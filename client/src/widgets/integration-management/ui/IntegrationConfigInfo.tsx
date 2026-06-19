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
      return (
        <span>Логин - {(integration.config as FullyKioskConfig).login}</span>
      );

    case 'adb':
      return (
        <span>
          ADB порт -{' '}
          {(integration.config as AdbConfig).port ?? integration.port}
        </span>
      );

    case 'philips_jointspace':
      return (
        <span>
          Device ID - {(integration.config as PhilipsJointspaceConfig).deviceId}
        </span>
      );

    default:
      return null;
  }
}
