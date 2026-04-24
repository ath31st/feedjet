import {
  RotationInterval,
  type RotationIntervalProps,
} from '@/shared/ui/RotationInterval';
import { useRotationInterval } from '../model/useRotationInterval';

interface ImageRotationIntervalProps
  extends Omit<RotationIntervalProps, 'inputId' | 'value' | 'update'> {
  kioskId: number;
}

export function ImageRotationInterval({
  kioskId,
  ...props
}: ImageRotationIntervalProps) {
  const { value, update } = useRotationInterval(kioskId, props.min, props.max);
  return (
    <RotationInterval
      inputId="image-rotation-interval"
      value={value}
      update={update}
      {...props}
    />
  );
}
