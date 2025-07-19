import type { ReactNode } from 'react';

interface FeedCardFrameProps {
  children: ReactNode;
}

export function FeedCardFrame({ children }: FeedCardFrameProps) {
  return (
    <div
      className="box-border flex h-full 4k:rounded-4xl rounded-xl 4k:border-4 border-2 4k:p-4 p-2 shadow-2xl"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      {children}
    </div>
  );
}
