import type { RotationIntervalProps } from '@/shared/ui/RotationInterval';
import { useRotationInterval } from '../model/useRotationInterval';
import { DurationInput } from '@/shared/ui';

interface FeedRotationIntervalProps
  extends Omit<RotationIntervalProps, 'inputId' | 'value' | 'update'> {
  kioskId: number;
}

export function FeedRotationInterval({
  kioskId,
  ...props
}: FeedRotationIntervalProps) {
  const { value, update } = useRotationInterval(kioskId, props.min, props.max);
  return (
    <div className="flex items-center justify-center">
      <DurationInput
        value={value}
        onChange={update}
        min={10}
        max={10000}
        size="md"
      />
    </div>
  );
}
