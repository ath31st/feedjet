import { useFeedConfigSse } from '@/entities/feed-config';
import { useUiConfigSse } from '@/entities/ui-config';
import { useControlSse } from '@/features/kiosk-control';

export function AdminInitializer() {
  useUiConfigSse();
  useFeedConfigSse();
  useControlSse();
  return null;
}
