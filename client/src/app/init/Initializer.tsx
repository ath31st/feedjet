import { useRssFeedSse } from '@/entities/feed';
import { useKioskConfigSse } from '@/entities/kiosk-config';
import { useUiConfigSse } from '@/entities/ui-config';
import { useControlSse } from '@/features/kiosk-control';

export function Initializer() {
  useUiConfigSse();
  useKioskConfigSse();
  useRssFeedSse();
  useControlSse();
  return null;
}
