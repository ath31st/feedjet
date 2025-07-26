import { useKioskConfigInit } from '../hooks/sse/useKioskConfigInit';
import { useRssFeedInit } from '../hooks/sse/useRssFeedInit';

export function Initializer() {
  useKioskConfigInit();
  useRssFeedInit();
  return null;
}
