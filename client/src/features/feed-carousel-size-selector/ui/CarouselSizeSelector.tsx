import { useFeedConfigFields } from '@/entities/feed-config';
import { NumberSliderSelector } from '@/shared/ui/NumberSliderSelector';

interface NumberSliderSelectorProps {
  kioskId: number;
}

export function CarouselSizeSelector({ kioskId }: NumberSliderSelectorProps) {
  const { carouselSize, setCarouselSize } = useFeedConfigFields(kioskId);
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
