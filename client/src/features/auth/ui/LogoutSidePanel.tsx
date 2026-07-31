import { ExitIcon } from '@radix-ui/react-icons';
import { useLogout } from '../model/useAuth';

export function LogoutSidePanel() {
  const logout = useLogout();

  return (
    <div className="group fixed top-20 right-0 z-10 flex h-9 w-4 transform flex-col justify-center overflow-hidden rounded-l-lg bg-(--button-bg) p-2 shadow-md transition-all duration-300 hover:w-48">
      <button
        type="button"
        onClick={logout}
        className="flex w-full cursor-pointer items-center gap-2 text-(--text) opacity-0 transition-all duration-300 hover:opacity-100 group-hover:opacity-100"
      >
        <ExitIcon className="h-5 w-5 shrink-0" />
        <span className="whitespace-nowrap text-xs">Выйти</span>
      </button>
    </div>
  );
}
