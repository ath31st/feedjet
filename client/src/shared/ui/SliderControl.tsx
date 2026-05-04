import * as Slider from '@radix-ui/react-slider';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderControlProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex justify-between text-(--meta-text) text-xs">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <Slider.Root
        value={[value]}
        onValueChange={(val) => {
          onChange(val[0]);
        }}
        min={min}
        max={max}
        step={step}
        className="relative flex h-2 w-full touch-none select-none items-center"
      >
        <Slider.Track className="relative h-2 w-full grow rounded-full bg-(--border)">
          <Slider.Range className="absolute h-full rounded-full bg-(--text)" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 cursor-pointer rounded-full bg-(--text)" />
      </Slider.Root>

      <div className="flex justify-between text-(--meta-text) text-xs">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
