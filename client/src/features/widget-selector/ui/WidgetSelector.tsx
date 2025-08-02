import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { widgetTypes } from '@shared/types/ui.config';
import { useWidgetSelector } from '../model/useWidgetSelector';

export function WidgetSelector() {
  const { rotatingWidgets, handleWidgetChange } = useWidgetSelector();

  return (
    <ToggleGroup.Root
      type="multiple"
      className="flex w-32 flex-wrap items-start gap-1 rounded-lg border border-[var(--border)] p-2"
      value={rotatingWidgets}
      onValueChange={(next) => {
        if (next.length === 0) return;
        handleWidgetChange(next);
      }}
    >
      {widgetTypes.map((t) => (
        <ToggleGroup.Item
          key={t}
          value={t}
          className="cursor-pointer rounded-md px-2 py-1 text-sm hover:bg-[var(--button-hover-bg)] data-[state=on]:bg-[var(--button-bg)] "
        >
          {t}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
