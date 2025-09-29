import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { widgetTypes, widgetLabels } from '@shared/types/ui.config';
import { useWidgetSelector } from '../model/useWidgetSelector';

interface WidgetSelectorProps {
  kioskId: number;
}

export function WidgetSelector({ kioskId }: WidgetSelectorProps) {
  const { rotatingWidgets, handleWidgetChange, isLoading } =
    useWidgetSelector(kioskId);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[var(--text)]">Виджеты в ротации:</span>
      {isLoading ? (
        <span className="text-[var(--meta-text)] text-sm">Загрузка…</span>
      ) : (
        <ToggleGroup.Root
          type="multiple"
          className="flex justify-center gap-1 rounded-lg border border-[var(--border)] p-1"
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
              className="w-24 cursor-pointer rounded-lg px-2 py-1 text-sm hover:bg-[var(--button-hover-bg)] data-[state=on]:bg-[var(--button-bg)]"
            >
              {widgetLabels[t]}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      )}
    </div>
  );
}
