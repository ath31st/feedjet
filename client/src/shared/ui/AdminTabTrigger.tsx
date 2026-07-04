import * as Tabs from '@radix-ui/react-tabs';
import { baseActionClass } from '../styles';
import type { LucideIcon } from 'lucide-react';

interface AdminTabTriggerProps {
  value: string;
  children: React.ReactNode;
  icon?: LucideIcon;
}

export function AdminTabTrigger({
  value,
  children,
  icon: Icon,
}: AdminTabTriggerProps) {
  return (
    <Tabs.Trigger value={value} className={baseActionClass}>
      <div className="flex cursor-pointer items-center gap-2">
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        <span className="truncate">{children}</span>
      </div>
    </Tabs.Trigger>
  );
}
