import * as Tabs from '@radix-ui/react-tabs';
import { baseActionClass } from '../styles';

interface AdminTabTriggerProps {
  value: string;
  children: React.ReactNode;
}

export function AdminTabTrigger({ value, children }: AdminTabTriggerProps) {
  return (
    <Tabs.Trigger value={value} className={baseActionClass}>
      {children}
    </Tabs.Trigger>
  );
}
