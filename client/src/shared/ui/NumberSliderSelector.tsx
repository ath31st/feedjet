import * as Slider from '@radix-ui/react-slider';

interface NumberSliderSelectorProps {
  label: string;
  value: number;
  setValue: (val: number) => void;
  min?: number;
  max?: number;
}

export function NumberSliderSelector({
  label,
  value,
  setValue,
  min = 1,
  max = 10,
}: NumberSliderSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[var(--text)]">
        {label}: {value}
      </span>
      <Slider.Root
        className="relative flex h-5 items-center"
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([val]) => setValue(val)}
      >
        <Slider.Track className="relative h-1 w-full grow cursor-pointer rounded-full bg-[var(--border)]">
          <Slider.Range className="absolute h-full rounded-full bg-[var(--text)]" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 cursor-pointer rounded-full bg-[var(--text)] focus:outline-none" />
      </Slider.Root>
    </div>
  );
}
