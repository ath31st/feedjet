import { useRssFeedSse } from '@/entities/feed/api/useRssFeedSse';
import { useKioskConfigSse } from '@/entities/kiosk-config/api/useKioskConfigSse';
import { useControlSse } from '@/features/kiosk-control/model/useControl';

export function Initializer() {
  useKioskConfigSse();
  useRssFeedSse();
  useControlSse();
  return null;
}
