import type { ReactNode } from 'react';

interface SettingsCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function SettingsCard({
  children,
  title,
  className = '',
}: SettingsCardProps) {
  return (
    <section
      className={`rounded-xl p-6 ${className}`}
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      {title && <h2 className="mb-4 font-semibold text-xl">{title}</h2>}
      {children}
    </section>
  );
}
