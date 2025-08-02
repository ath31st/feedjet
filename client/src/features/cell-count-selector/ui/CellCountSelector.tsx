import { NumberSliderSelector } from '@/shared/ui/NumberSliderSelector';
import { useConfigNumberField } from '@/entities/feed-config';

export function CellCountSelector() {
  const { value, set } = useConfigNumberField('cellsPerPage');
  return (
    <NumberSliderSelector
      label="Ячеек на странице"
      value={value}
      setValue={set}
    />
  );
}
