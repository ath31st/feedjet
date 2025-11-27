import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { CommonButton } from './common/CommonButton';
import { useMemo, useState } from 'react';
import { formatSecondsToTime } from '../lib';
import { SimpleDropdownMenu } from './common';

const STEP_OPTIONS = [
  { key: '1 сек', value: 1 },
  { key: '10 сек', value: 10 },
  { key: '1 мин', value: 60 },
  { key: '10 мин', value: 600 },
];

export interface RotationIntervalProps {
  label: string;
  inputId: string;
  value: number;
  update: (val: number) => void;
  min?: number;
  max?: number;
}

export function RotationInterval({
  label,
  inputId,
  value,
  update,
  min = 10,
  max = 10000,
}: RotationIntervalProps) {
  const [selectedStep, setSelectedStep] = useState(10);
  const formattedValue = useMemo(() => formatSecondsToTime(value), [value]);
  const currentStepKey = useMemo(() => {
    return (
      STEP_OPTIONS.find((opt) => opt.value === selectedStep)?.key ||
      STEP_OPTIONS[1].key
    );
  }, [selectedStep]);
  const stepKeys = useMemo(() => STEP_OPTIONS.map((opt) => opt.key), []);

  const handleDecrement = () => {
    const newValue = Math.max(0, value - selectedStep);
    if (newValue < min) return;
    update(newValue);
  };

  const handleIncrement = () => {
    if (value + selectedStep > max) return;
    update(value + selectedStep);
  };

  const handleStepChange = (newStepKey: string) => {
    const newStepOption = STEP_OPTIONS.find((opt) => opt.key === newStepKey);

    if (newStepOption) {
      setSelectedStep(newStepOption.value);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-[var(--text)]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <CommonButton
          type="button"
          onClick={handleDecrement}
          disabled={value === 0}
        >
          <MinusIcon className="" />
        </CommonButton>

        <div className="min-w-[100px]">
          <SimpleDropdownMenu
            value={currentStepKey}
            options={stepKeys}
            onSelect={handleStepChange}
          />
        </div>

        <CommonButton
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
        >
          <PlusIcon />
        </CommonButton>

        <span
          id={inputId}
          className="min-w-[120px] text-center font-semibold text-[var(--text)]"
        >
          {formattedValue}
        </span>
      </div>
    </div>
  );
}
