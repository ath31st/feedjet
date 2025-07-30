import { useLogout } from '../model/useAuth';
import logoutUrl from '@/shared/assets/logout_icon.png';

export function LogoutButton() {
  const logout = useLogout();

  return (
    <button
      type="button"
      onClick={logout}
      className="cursor-pointer hover:opacity-50"
    >
      <img src={logoutUrl} alt="Logout Icon" width={50} height={50} />
    </button>
  );
}
