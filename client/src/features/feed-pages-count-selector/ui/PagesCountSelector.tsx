import { useConfigNumberField } from '@/entities/feed-config/lib/useConfigNumberField';
import { NumberSliderSelector } from '@/shared/ui/NumberSliderSelector';

export function PagesCountSelector() {
  const { value, set } = useConfigNumberField('pagesCount');
  return (
    <NumberSliderSelector
      label="Страниц в карусели"
      value={value}
      setValue={set}
    />
  );
}
