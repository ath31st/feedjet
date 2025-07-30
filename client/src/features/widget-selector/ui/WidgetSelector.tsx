import { useWidgetSelector } from '../model/useWidgetSelector';
import { widgetTypes } from '@shared/types/ui.config';

export function WidgetSelector() {
  const { rotatingWidgets, handleWidgetChange } = useWidgetSelector();

  if (!rotatingWidgets?.length) return <p>Виджеты недоступны</p>;

  return (
    <select
      multiple
      style={{ backgroundColor: 'var(--card-bg)' }}
      value={rotatingWidgets}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions).map(
          (o) => o.value,
        );
        handleWidgetChange(selected);
      }}
      className="w-32 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
    >
      {widgetTypes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
