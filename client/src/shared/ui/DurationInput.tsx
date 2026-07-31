import * as Popover from '@radix-ui/react-popover';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { formatDuration } from '../lib/formatDuration';

interface DurationInputProps {
  value: number;
  onChange: (seconds: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
  /** Step for seconds column. Default 5. */
  secondStep?: number;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function range(from: number, to: number, step = 1) {
  const out: number[] = [];
  for (let n = from; n <= to; n += step) out.push(n);
  return out;
}

function scrollSelectedIntoColumn(btn: HTMLButtonElement | null) {
  const parent = btn?.parentElement;
  if (!btn || !parent) return;
  parent.scrollTop =
    btn.offsetTop - parent.clientHeight / 2 + btn.clientHeight / 2;
}

const popoverMotion = {
  initial: { opacity: 0, y: -6, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.96 },
  transition: { duration: 0.15, ease: 'easeOut' as const },
};

export function DurationInput({
  value,
  onChange,
  min = 1,
  max = 3600,
  size = 'sm',
  className,
  secondStep = 5,
}: DurationInputProps) {
  const [open, setOpen] = useState(false);
  const minColRef = useRef<HTMLButtonElement | null>(null);
  const secColRef = useRef<HTMLButtonElement | null>(null);

  const total = clamp(Math.round(value), min, max);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  const maxMinutes = Math.floor(max / 60);
  const minuteOptions = useMemo(() => range(0, maxMinutes), [maxMinutes]);

  const secondOptions = useMemo(() => {
    const stepped = range(0, 55, secondStep);
    if (seconds % secondStep === 0) return stepped;
    return [...stepped, seconds].sort((a, b) => a - b);
  }, [secondStep, seconds]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      scrollSelectedIntoColumn(minColRef.current);
      scrollSelectedIntoColumn(secColRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const commit = (m: number, s: number) => {
    onChange(clamp(m * 60 + s, min, max));
  };

  const isDisabled = (m: number, s: number) => {
    const t = m * 60 + s;
    return t < min || t > max;
  };

  const heightCls = size === 'sm' ? 'h-7 px-2 text-xs' : 'h-9 px-3 text-sm';

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`inline-flex cursor-pointer items-center justify-center rounded-lg border border-(--border) bg-(--card-bg) font-mono tabular-nums hover:bg-(--button-hover-bg) focus:outline-none focus:ring-(--border) focus:ring-1 ${heightCls} ${className ?? ''}`.trim()}
          aria-label="Длительность"
        >
          {formatDuration(total)}
        </button>
      </Popover.Trigger>

      <Popover.Portal forceMount>
        <AnimatePresence>
          {open && (
            <Popover.Content
              forceMount
              asChild
              align="center"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                key="duration-popover"
                {...popoverMotion}
                className="z-50 rounded-lg border border-(--border) bg-(--card-bg) p-1 shadow-md"
              >
                <div className="flex gap-1">
                  <Column
                    label="мин"
                    options={minuteOptions}
                    selected={minutes}
                    selectedRef={minColRef}
                    isOptionDisabled={(m) =>
                      secondOptions.every((s) => isDisabled(m, s))
                    }
                    onSelect={(m) => commit(m, seconds)}
                  />
                  <Column
                    label="сек"
                    options={secondOptions}
                    selected={seconds}
                    selectedRef={secColRef}
                    isOptionDisabled={(s) => isDisabled(minutes, s)}
                    onSelect={(s) => commit(minutes, s)}
                  />
                </div>
              </motion.div>
            </Popover.Content>
          )}
        </AnimatePresence>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Column({
  label,
  options,
  selected,
  selectedRef,
  isOptionDisabled,
  onSelect,
}: {
  label: string;
  options: number[];
  selected: number;
  selectedRef: RefObject<HTMLButtonElement | null>;
  isOptionDisabled: (n: number) => boolean;
  onSelect: (n: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="px-1 text-center text-(--text-muted) text-[10px] uppercase tracking-wide">
        {label}
      </span>
      <div className="scrollbar-hide h-40 w-10 overflow-y-auto rounded-lg border border-(--border)">
        {options.map((n) => {
          const disabled = isOptionDisabled(n);
          const isSelected = n === selected;
          return (
            <button
              key={n}
              ref={isSelected ? selectedRef : undefined}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(n)}
              className={`flex w-full items-center justify-center py-1.5 font-mono text-sm tabular-nums outline-none ${
                isSelected
                  ? 'bg-(--button-hover-bg) font-semibold'
                  : 'hover:bg-(--button-hover-bg)/50'
              } ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`}
            >
              {String(n).padStart(2, '0')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
