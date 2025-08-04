import { NumberSliderSelector } from '@/shared/ui/NumberSliderSelector';
import { useConfigNumberField } from '@/entities/feed-config';

export function VisibleCellCountSelector() {
  const { value, set } = useConfigNumberField('visibleCellCount');
  return (
    <NumberSliderSelector
      label="Ячеек на странице"
      value={value}
      setValue={set}
    />
  );
}
