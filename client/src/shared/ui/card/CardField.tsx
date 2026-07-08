interface CardFieldProps {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CardField({ label, children, className }: CardFieldProps) {
  return (
    <div className={`text-sm ${className ?? ''}`}>
      <strong className="text-(--meta-text)">{label}:</strong> {children}
    </div>
  );
}
