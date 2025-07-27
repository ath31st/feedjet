import { useKioskConfigSse } from '../hooks/sse/useKioskConfigSse';
import { useRssFeedSse } from '../hooks/sse/useRssFeedSse';
import { useControlSse } from '../hooks/sse/useControl';

export function Initializer() {
  useKioskConfigSse();
  useRssFeedSse();
  useControlSse();
  return null;
}
