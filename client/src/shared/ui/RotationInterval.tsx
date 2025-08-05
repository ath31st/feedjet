import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { CommonButton } from './common/CommonButton';

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
        <CommonButton type="button" onClick={() => update(value - step)}>
          <MinusIcon className="" />
        </CommonButton>
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
          className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
        />
        <CommonButton type="button" onClick={() => update(value + step)}>
          <PlusIcon />
        </CommonButton>
        <span className="text-[var(--text-secondary)] text-sm">секунд</span>
      </div>
    </div>
  );
}
