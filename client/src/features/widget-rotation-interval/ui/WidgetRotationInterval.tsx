import {
  RotationInterval,
  type RotationIntervalProps,
} from '@/shared/ui/RotationInterval';
import { useRotationInterval } from '../model/useRotationInterval';

export function WidgetRotationInterval(
  props: Omit<RotationIntervalProps, 'label' | 'inputId' | 'value' | 'update'>,
) {
  const { value, update } = useRotationInterval(props.min, props.max);
  return (
    <RotationInterval
      label="Интервал смены виджетов (в секундах):"
      inputId="widget-rotation-interval"
      value={value}
      update={update}
      {...props}
    />
  );
}
