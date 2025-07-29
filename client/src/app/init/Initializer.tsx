import { useRssFeedSse } from '@/entities/feed';
import { useFeedConfigSse } from '@/entities/feed-config';
import { useUiConfigSse } from '@/entities/ui-config';
import { useControlSse } from '@/features/kiosk-control';

export function Initializer() {
  useUiConfigSse();
  useFeedConfigSse();
  useRssFeedSse();
  useControlSse();
  return null;
}
