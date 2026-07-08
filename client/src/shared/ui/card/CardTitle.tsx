interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <div className={`font-semibold text-lg ${className ?? ''}`}>{children}</div>
  );
}
