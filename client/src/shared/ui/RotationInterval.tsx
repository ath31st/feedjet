export interface RotationIntervalProps {
  label: string;
  inputId: string;
  value: number;
  update: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function RotationInterval({
  label,
  inputId,
  value,
  update,
  min = 10,
  max = 10000,
  step = 10,
}: RotationIntervalProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-[var(--text)]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => update(value - step)}
          className="h-10 w-8 rounded-lg border border-[var(--border)] px-2 py-1 hover:bg-[var(--button-hover-bg)]"
        >
          -
        </button>
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!Number.isNaN(val)) update(val);
          }}
          min={min}
          max={max}
          className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
        />
        <button
          type="button"
          onClick={() => update(value + step)}
          className="h-10 w-8 rounded-lg border border-[var(--border)] px-2 py-1 hover:bg-[var(--button-hover-bg)]"
        >
          +
        </button>
        <span className="text-[var(--text-secondary)] text-sm">секунд</span>
      </div>
    </div>
  );
}
