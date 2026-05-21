import { useEffect } from 'react';

type Mode = 'admin' | 'kiosk';

interface Props {
  mode: Mode;
  children: React.ReactNode;
}

export function ModeSetter({ mode, children }: Props) {
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return children;
}
