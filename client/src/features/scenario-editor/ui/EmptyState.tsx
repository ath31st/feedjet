import { CalendarDays } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-(--text-muted)">
      <CalendarDays size={48} strokeWidth={1} />

      <p className="text-lg">Сценарий пуст</p>
    </div>
  );
}
