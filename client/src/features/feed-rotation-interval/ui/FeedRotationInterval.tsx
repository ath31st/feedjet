import { useRotaionInterval } from '../model/useRotationInterval';

interface FeedRotationIntervalProps {
  min?: number;
  max?: number;
}

export function FeedRotationInterval({
  min = 10,
  max = 10000,
}: FeedRotationIntervalProps) {
  const { intervalSec, handleInterval } = useRotaionInterval();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val) && val >= min && val <= max) {
      handleInterval(val);
    }
  };

  return (
    <input
      type="number"
      value={intervalSec}
      onChange={handleChange}
      min={min}
      max={max}
      className="w-32 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
    />
  );
}
