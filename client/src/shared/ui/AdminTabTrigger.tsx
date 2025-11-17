import * as Tabs from '@radix-ui/react-tabs';

interface AdminTabTriggerProps {
  value: string;
  children: React.ReactNode;
}

export function AdminTabTrigger({ value, children }: AdminTabTriggerProps) {
  return (
    <Tabs.Trigger
      value={value}
      className={`relative w-38 px-6 py-2 font-medium text-md text-muted-foreground outline-none transition-colors hover:text-[color:var(--button-hover-bg)] data-[state=active]:border-none data-[state=active]:bg-gradient-to-t data-[state=active]:from-[color-mix(in_srgb,var(--border)_20%,transparent)] data-[state=active]:to-transparent data-[state=active]:text-[color:var(--text)]`}
    >
      {children}
    </Tabs.Trigger>
  );
}
