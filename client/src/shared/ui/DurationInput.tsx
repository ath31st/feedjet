interface DurationInputProps {
  value: number;
  onChange: (seconds: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function DurationInput({
  value,
  onChange,
  min = 1,
  max = 3600,
  size = 'sm',
  className,
}: DurationInputProps) {
  const total = Math.max(0, Math.round(value));
  const minPart = Math.floor(total / 60);
  const secPart = total % 60;

  const commit = (m: number, s: number) => {
    const safe = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
    const seconds = safe(m) * 60 + safe(s);
    onChange(Math.max(min, Math.min(max, seconds)));
  };

  const heightCls = size === 'sm' ? 'h-7' : 'h-9';
  const textCls = size === 'sm' ? 'text-xs' : 'text-sm';

  const inputCls = `w-12 border border-(--border) px-2 text-center font-mono outline-none focus:border-(--border) ${heightCls} ${textCls}`;
  const labelCls = `px-1.5 ${textCls}`;

  const containerCls =
    `inline-flex items-center overflow-hidden rounded-lg border border-(--border) ${className || ''}`.trim();

  return (
    <div className={containerCls}>
      <input
        type="number"
        min={0}
        max={Math.floor(max / 60)}
        value={minPart}
        onChange={(e) => commit(Number(e.target.value), secPart)}
        className={`${inputCls} rounded-none border-0`}
        aria-label="минуты"
      />
      <span className={labelCls}>мин</span>
      <input
        type="number"
        min={0}
        max={59}
        value={secPart}
        onChange={(e) => commit(minPart, Number(e.target.value))}
        className={`${inputCls} rounded-none border-0 border-l`}
        aria-label="секунды"
      />
      <span className={`${labelCls} pr-2`}>сек</span>
    </div>
  );
}
