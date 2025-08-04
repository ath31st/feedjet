import { useFeedConfigFields } from '@/entities/feed-config';
import { NumberSliderSelector } from '@/shared/ui/NumberSliderSelector';

export function CarouselSizeSelector() {
  const { carouselSize, setCarouselSize } = useFeedConfigFields();
  return (
    <NumberSliderSelector
      max={60}
      min={1}
      label="Размер карусели"
      value={carouselSize}
      setValue={setCarouselSize}
    />
  );
}
