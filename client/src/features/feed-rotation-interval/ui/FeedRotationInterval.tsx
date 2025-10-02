import {
  RotationInterval,
  type RotationIntervalProps,
} from '@/shared/ui/RotationInterval';
import { useRotationInterval } from '../model/useRotationInterval';

interface FeedRotationIntervalProps
  extends Omit<
    RotationIntervalProps,
    'label' | 'inputId' | 'value' | 'update'
  > {
  kioskId: number;
}

export function FeedRotationInterval({
  kioskId,
  ...props
}: FeedRotationIntervalProps) {
  const { value, update } = useRotationInterval(kioskId, props.min, props.max);
  return (
    <RotationInterval
      label="Интервал смены ленты (в секундах):"
      inputId="feed-rotation-interval"
      value={value}
      update={update}
      {...props}
    />
  );
}
