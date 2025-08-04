import { useConfigNumberField } from '@/entities/feed-config/lib/useConfigNumberField';
import { NumberSliderSelector } from '@/shared/ui/NumberSliderSelector';

export function CarouselSizeSelector() {
  const { value, set } = useConfigNumberField('carouselSize');
  return (
    <NumberSliderSelector
      max={60}
      min={1}
      label="Размер карусели"
      value={value}
      setValue={set}
    />
  );
}
