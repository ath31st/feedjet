import { useRssFeedSse } from '@/entities/feed';
import { useFeedConfigSse } from '@/entities/feed-config';
import { useUiConfigSse } from '@/entities/ui-config';
import { useVideoSse } from '@/entities/video';
import { useControlSse } from '@/features/kiosk-control';
import { useKioskInitialization } from './useKioskInitialization';

export function KioskInitializer() {
  useKioskInitialization();

  useUiConfigSse();
  useFeedConfigSse();
  useRssFeedSse();
  useControlSse();
  useVideoSse();
  return null;
}
