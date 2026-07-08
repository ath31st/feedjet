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
      className={`flex items-start justify-between rounded-lg border border-(--border) bg-(--card-bg) p-3 ${className ?? ''}`}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {controls && <div className="mr-4 ml-auto flex gap-2">{controls}</div>}
      {actions && <div className="ml-auto flex gap-2">{actions}</div>}
    </div>
  );
}
