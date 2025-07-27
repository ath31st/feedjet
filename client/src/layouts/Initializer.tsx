import { useKioskConfigInit } from '../hooks/sse/useKioskConfigInit';
import { useRssFeedInit } from '../hooks/sse/useRssFeedInit';
import { useControlSse } from '../hooks/sse/useControl';

export function Initializer() {
  useKioskConfigInit();
  useRssFeedInit();
  useControlSse();
  return null;
}
