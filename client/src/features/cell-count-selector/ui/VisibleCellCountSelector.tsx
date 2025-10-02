import { NumberSliderSelector } from '@/shared/ui/NumberSliderSelector';
import { useFeedConfigFields } from '@/entities/feed-config';

interface NumberSliderSelectorProps {
  kioskId: number;
}

export function VisibleCellCountSelector({
  kioskId,
}: NumberSliderSelectorProps) {
  const { visibleCellCount, setVisibleCellCount } =
    useFeedConfigFields(kioskId);
  return (
    <NumberSliderSelector
      max={10}
      min={1}
      label="Ячеек на странице"
      value={visibleCellCount}
      setValue={setVisibleCellCount}
    />
  );
}
