import { useDeviceStore, useSendHeartbeat } from '@/entities/device';
import { useKioskParams } from '@/features/kiosk-params';
import { useEffect, useEffectEvent } from 'react';

export function HeartbeatProvider({ children }: { children: React.ReactNode }) {
  const { mutate: registerDevice } = useSendHeartbeat();
  const { slug } = useKioskParams();
  const deviceId = useDeviceStore((s) => s.deviceId);

  const payload = {
    slug,
    deviceId,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  };

  const sendHeartbeat = useEffectEvent(() => {
    registerDevice({ data: payload });
  });

  useEffect(() => {
    sendHeartbeat();

    const id = setInterval(() => {
      sendHeartbeat();
    }, 60_000);

    return () => clearInterval(id);
  }, []);

  return <>{children}</>;
}
