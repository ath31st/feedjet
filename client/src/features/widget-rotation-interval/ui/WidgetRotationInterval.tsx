import {
  RotationInterval,
  type RotationIntervalProps,
} from '@/shared/ui/RotationInterval';
import { useRotationInterval } from '../model/useRotationInterval';

interface WidgetRotationIntervalProps
  extends Omit<
    RotationIntervalProps,
    'label' | 'inputId' | 'value' | 'update'
  > {
  kioskId: number;
}

export function WidgetRotationInterval({
  kioskId,
  ...props
}: WidgetRotationIntervalProps) {
  const { value, update } = useRotationInterval(kioskId, props.min, props.max);
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
