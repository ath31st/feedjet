import { useRssFeedSse } from '@/entities/feed';
import { useFeedConfigSse } from '@/entities/feed-config';
import { useUiConfigSse } from '@/entities/ui-config';
import { useVideoSse } from '@/entities/video';
import { useControlSse } from '@/features/kiosk-control';

export function KioskInitializer() {
  useUiConfigSse();
  useFeedConfigSse();
  useRssFeedSse();
  useControlSse();
  useVideoSse();
  return null;
}
