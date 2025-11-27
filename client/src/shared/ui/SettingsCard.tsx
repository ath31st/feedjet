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
      {/* {title && <h2 className="mb-4 font-semibold text-xl">{title}</h2>} */}
      {title && (
        <h2
          className="mb-4 inline-block w-full rounded-lg px-2 py-2 font-semibold text-xl"
          style={{
            background:
              'linear-gradient(to right, var(--button-bg), var(--card-bg) 90%)',
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
