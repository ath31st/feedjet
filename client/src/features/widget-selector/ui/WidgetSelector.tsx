import { widgetTypes } from '@shared/types/ui.config';
import { useWidgetSelector } from '../model/useWidgetSelector';
import { arraysEqual } from '@/shared/lib/isEqual';

export function WidgetSelector() {
  const { rotatingWidgets, handleWidgetChange } = useWidgetSelector();

  return (
    <select
      multiple
      className="h-20 w-32 overflow-hidden rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
    >
      {widgetTypes.map((t) => (
        <option
          key={t}
          value={t}
          selected={rotatingWidgets.includes(t)}
          onMouseDown={(e) => {
            e.preventDefault();
            const isSelected = rotatingWidgets.includes(t);
            const next = isSelected
              ? rotatingWidgets.length > 1
                ? rotatingWidgets.filter((v) => v !== t)
                : rotatingWidgets
              : [...rotatingWidgets, t];
            if (!arraysEqual(next, rotatingWidgets)) {
              handleWidgetChange(next);
            }
          }}
          style={{
            backgroundColor: rotatingWidgets.includes(t)
              ? 'var(--border)'
              : 'var(--card-bg)',
            color: rotatingWidgets.includes(t) ? 'var(--text)' : 'inherit',
          }}
        >
          {t}
        </option>
      ))}
    </select>
  );
}
