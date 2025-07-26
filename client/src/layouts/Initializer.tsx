import { useKioskConfigInit } from '../hooks/sse/useKioskConfigInit';

export function Initializer() {
  useKioskConfigInit();
  return null;
}
