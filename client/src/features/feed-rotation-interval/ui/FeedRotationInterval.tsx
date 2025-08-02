import {
  RotationInterval,
  type RotationIntervalProps,
} from '@/shared/ui/RotationInterval';
import { useRotationInterval } from '../model/useRotationInterval';

export function FeedRotationInterval(
  props: Omit<RotationIntervalProps, 'label' | 'inputId' | 'value' | 'update'>,
) {
  const { value, update } = useRotationInterval(props.min, props.max);
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
