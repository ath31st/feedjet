import { useEffect } from 'react';

interface Props {
  mode: string;
  children: React.ReactNode;
}

export function ModeSetter({ mode, children }: Props) {
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return children;
}
