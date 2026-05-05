import { useAdminHelp } from '../model/useAdminHelp';
import { CommonSwitch } from '@/shared/ui/common';

export function AdminHelpToggle() {
  const { enabled, setEnabled } = useAdminHelp();

  return (
    <div className="group fixed top-35 right-0 z-10 flex h-9 w-6 transform flex-col justify-center overflow-hidden rounded-l-lg bg-(--button-bg) p-2 shadow-md transition-all duration-300 hover:h-9 hover:w-48">
      <div className="flex items-center justify-between text-(--text-secondary) text-xs">
        <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Справочная панель
        </span>
        <CommonSwitch
          checked={enabled}
          onCheckedChange={setEnabled}
        ></CommonSwitch>
      </div>
    </div>
  );
}
