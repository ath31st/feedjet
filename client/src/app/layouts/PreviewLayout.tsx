import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { KioskInitializer } from '../init/KioskInitializer';
import { ThemeProvider } from '../providers/ThemeProvider';

const PREVIEW_NAVIGATE = 'kiosk-preview:navigate';

function usePreviewSoftNavigate() {
  const navigate = useNavigate();

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (typeof event.data !== 'object' || event.data === null) return;
      if (event.data.type !== PREVIEW_NAVIGATE) return;

      const path = event.data.path;
      if (typeof path !== 'string' || !path.startsWith('/preview/')) return;

      navigate(path, { replace: true });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [navigate]);
}

export function PreviewLayout() {
  usePreviewSoftNavigate();

  return (
    <ThemeProvider>
      <KioskInitializer />
      <Outlet />
    </ThemeProvider>
  );
}
