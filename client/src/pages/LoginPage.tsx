import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../features/auth';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoginForm onSuccess={() => navigate('/admin', { replace: true })} />
    </div>
  );
}
