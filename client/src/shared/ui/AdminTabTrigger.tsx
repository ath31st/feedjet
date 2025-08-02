import * as Tabs from '@radix-ui/react-tabs';

interface AdminTabTriggerProps {
  value: string;
  children: React.ReactNode;
}

export function AdminTabTrigger({ value, children }: AdminTabTriggerProps) {
  return (
    <Tabs.Trigger
      value={value}
      className="px-6 py-3 font-medium text-sm outline-none transition-colors hover:text-[color:var(--button-hover-bg)] data-[state=active]:border-[color:var(--border)] data-[state=active]:border-b-2 data-[state=active]:text-[color:var(--text)]"
    >
      {children}
    </Tabs.Trigger>
  );
}
