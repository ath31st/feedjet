import type { ReactNode } from 'react';
import { Spinner, type SpinnerSize } from './Spinner';

interface LoadingCenterProps {
  className?: string;
  fullScreen?: boolean;
  spinnerSize?: SpinnerSize;
  children?: ReactNode;
}

export function LoadingCenter({
  className,
  fullScreen = false,
  spinnerSize = 'md',
  children,
}: LoadingCenterProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'h-screen w-screen' : 'min-h-32 w-full'} ${className ?? ''}`}
    >
      {children ?? <Spinner size={spinnerSize} />}
    </div>
  );
}
