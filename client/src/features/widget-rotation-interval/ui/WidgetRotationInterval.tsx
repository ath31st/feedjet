import {
  RotationInterval,
  type RotationIntervalProps,
} from '@/shared/ui/RotationInterval';
import { useRotationInterval } from '../model/useRotationInterval';

interface WidgetRotationIntervalProps
  extends Omit<RotationIntervalProps, 'inputId' | 'value' | 'update'> {
  kioskId: number;
}

export function WidgetRotationInterval({
  kioskId,
  ...props
}: WidgetRotationIntervalProps) {
  const { value, update } = useRotationInterval(kioskId, props.min, props.max);
  return (
    <RotationInterval
      inputId="widget-rotation-interval"
      value={value}
      update={update}
      {...props}
    />
  );
}
