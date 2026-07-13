interface EntityCardProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  controls?: React.ReactNode;
  className?: string;
}

export function EntityCard({
  children,
  controls,
  actions,
  className,
}: EntityCardProps) {
  return (
    <div
      className={`relative rounded-lg border border-(--border) bg-(--card-bg) p-3 ${className ?? ''}`}
    >
      <div className="min-w-0">{children}</div>

      {(controls || actions) && (
        <div className="absolute top-3 right-3 flex items-center gap-4">
          {controls && <div className="flex gap-2">{controls}</div>}

          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
    </div>
  );
}
