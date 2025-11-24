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
      className={`rounded-lg bg-[var(--card-bg)] p-6 shadow-2xl ${className}`}
    >
      {title && <h2 className="mb-4 font-semibold text-xl">{title}</h2>}
      {children}
    </section>
  );
}
