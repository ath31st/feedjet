import type { ReactNode } from 'react';

interface FeedCardFrameProps {
  children: ReactNode;
}

export function FeedCardFrame({ children }: FeedCardFrameProps) {
  return (
    <div
      className="flex h-full 4k:rounded-4xl rounded-xl 4k:p-4 p-2 shadow-2xl"
      style={{
        backgroundColor: 'var(--card-bg)',
      }}
    >
      {children}
    </div>
  );
}
