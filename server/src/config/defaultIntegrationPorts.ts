import type { IntegrationType } from '@shared/types/integration.js';

export const DEFAULT_PORTS: Partial<Record<IntegrationType, number>> = {
  adb: 5555,
  fully_kiosk: 2323,
  philips_jointspace: 1926,
};
