import { NumberSliderSelector } from '@/shared/ui/NumberSliderSelector';
import { useFeedConfigFields } from '@/entities/feed-config';

export function VisibleCellCountSelector() {
  const { visibleCellCount, setVisibleCellCount } = useFeedConfigFields();
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
