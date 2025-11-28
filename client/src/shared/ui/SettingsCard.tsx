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
      className={`hover:-translate-y-1 relative z-0 transform rounded-lg bg-(--card-bg) p-6 shadow-2xl transition-all duration-400 before:absolute before:inset-0 before:z-1 before:rounded-lg before:border-(--border) before:border-1 before:opacity-0 before:transition-opacity before:duration-400 hover:before:opacity-100 ${className}
  `}
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
