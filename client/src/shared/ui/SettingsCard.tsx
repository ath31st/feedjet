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
      className={`hover:-translate-y-1 relative transform rounded-lg bg-[var(--card-bg)] p-6 shadow-2xl transition-transform duration-400 ${className}`}
    >
      {title && (
        <h2
          className="absolute top-0 left-0 w-full rounded-t-lg px-6 py-2 font-semibold text-xl"
          style={{
            background:
              'linear-gradient(to right, var(--button-bg), var(--card-bg) 90%)',
          }}
        >
          {title}
        </h2>
      )}
      <div className={title ? 'mt-10' : ''}>{children}</div>
    </section>
  );
}
