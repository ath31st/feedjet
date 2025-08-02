import * as Slider from '@radix-ui/react-slider';
import { useCellCount } from '../model/useCellCountSelector';

interface CellCountSelectorProps {
  min?: number;
  max?: number;
}

export function CellCountSelector({
  min = 1,
  max = 10,
}: CellCountSelectorProps) {
  const { cellCount, setCount } = useCellCount();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[var(--text)]">
        Количество ячеек на страницу: {cellCount}
      </span>
      <Slider.Root
        className="relative flex h-5 items-center"
        value={[cellCount]}
        min={min}
        max={max}
        step={1}
        onValueChange={([val]) => setCount(val)}
      >
        <Slider.Track className="relative h-1 w-full grow rounded-full bg-[var(--border)]">
          <Slider.Range className="absolute h-full rounded-full bg-[var(--text)]" />
        </Slider.Track>
        <Slider.Thumb className="block h-4 w-4 rounded-full bg-[var(--text)] focus:outline-none" />
      </Slider.Root>
    </div>
  );
}
