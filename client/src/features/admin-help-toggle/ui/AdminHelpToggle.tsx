import * as Switch from '@radix-ui/react-switch';
import { useAdminHelp } from '../model/useAdminHelp';
import { SidebarPanel } from '@/shared/ui';

export function AdminHelpToggle() {
  const { enabled, setEnabled } = useAdminHelp();

  return (
    <SidebarPanel top={140} hoverHeight={9} hoverWidth={48}>
      <div className="flex items-center justify-between text-(--text-secondary) text-xs">
        <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Справочная панель
        </span>
        <Switch.Root
          checked={enabled}
          onCheckedChange={setEnabled}
          className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-(--border) transition-colors data-[state=checked]:bg-(--button-bg)"
        >
          <Switch.Thumb className="block h-4 w-4 translate-x-px rounded-full bg-(--text) transition-transform data-[state=checked]:translate-x-5.25" />
        </Switch.Root>
      </div>
    </SidebarPanel>
  );
}
