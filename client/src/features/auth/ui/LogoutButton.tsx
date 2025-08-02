import { CommonButton } from '@/shared/ui/common/CommonButton';
import { useLogout } from '../model/useAuth';

export function LogoutButton() {
  const logout = useLogout();

  return (
    <CommonButton
      type="button"
      text="Выход"
      onClick={logout}
      disabled={false}
    />
  );
}
