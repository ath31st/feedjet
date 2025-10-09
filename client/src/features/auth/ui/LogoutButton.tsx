import { CommonButton } from '@/shared/ui/common';
import { useLogout } from '../model/useAuth';
import { ExitIcon } from '@radix-ui/react-icons';

export function LogoutButton() {
  const logout = useLogout();

  return (
    <CommonButton type="button" onClick={logout} disabled={false}>
      <ExitIcon className="h-5 w-5" />
    </CommonButton>
  );
}
