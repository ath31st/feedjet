import { useRssFeedSse } from '@/entities/feed';
import { useKioskConfigSse } from '@/entities/kiosk-config';
import { useControlSse } from '@/features/kiosk-control/model/useControl';

export function Initializer() {
  useKioskConfigSse();
  useRssFeedSse();
  useControlSse();
  return null;
}
