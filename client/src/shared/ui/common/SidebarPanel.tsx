import type { CSSProperties, ReactNode } from 'react';

interface SidebarPanelProps {
  children: ReactNode;
  top?: number;
  hoverHeight?: number;
  hoverWidth?: number;
  className?: string;
  style?: CSSProperties;
}

export function SidebarPanel({
  children,
  top = 45,
  hoverHeight = 64,
  hoverWidth = 48,
  className = '',
  style,
}: SidebarPanelProps) {
  return (
    <div
      className={`group fixed right-0 z-10 flex h-9 w-6 transform flex-col overflow-hidden rounded-l-lg bg-(--button-bg) p-2 shadow-md transition-all duration-300 hover:h-${hoverHeight} hover:w-${hoverWidth} ${className}`}
      style={{ top: `${top}px`, ...style }}
    >
      {children}
    </div>
  );
}
