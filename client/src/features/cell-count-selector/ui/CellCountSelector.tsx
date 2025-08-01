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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val) && val >= min && val <= max) {
      setCount(val);
    }
  };

  return (
    <input
      type="number"
      value={cellCount}
      onChange={handleChange}
      min={min}
      max={max}
      className="w-32 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
    />
  );
}
