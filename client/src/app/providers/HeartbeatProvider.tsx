import { useSendHeartbeat } from '@/features/kiosk-heartbeat';
import { useKioskParams } from '@/features/kiosk-params';
import { useEffect, useEffectEvent } from 'react';

export function HeartbeatProvider({ children }: { children: React.ReactNode }) {
  const mutation = useSendHeartbeat();
  const { slug } = useKioskParams();

  const sendHeartbeat = useEffectEvent(() => {
    mutation.mutate({ slug });
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
