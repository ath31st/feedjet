import type { ReactNode } from 'react';

interface FeedCardFrameProps {
  children: ReactNode;
}

export function FeedCardFrame({ children }: FeedCardFrameProps) {
  return (
    <div
      className="flex h-full rounded-xl p-2 shadow-2xl"
      style={{
        backgroundColor: 'var(--card-bg)',
      }}
    >
      {children}
    </div>
  );
}
