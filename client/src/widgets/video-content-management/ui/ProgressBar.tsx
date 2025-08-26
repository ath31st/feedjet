interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const getColor = () => {
    if (value > 90) return 'bg-red-500';
    if (value > 80) return 'bg-yellow-600';
    return 'bg-[var(--button-hover-bg)]';
  };

  return (
    <div className="h-20 w-full rounded-lg bg-[var(--button-bg)]">
      <div
        className={`h-20 rounded-lg transition-all duration-300 ${getColor()}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
