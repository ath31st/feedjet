import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMe } from '../hooks/useAuth';
import { LoadingThreeDotsJumping } from '../components/LoadingThreeDotsJumping';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMe();

  useEffect(() => {
    if (error?.data?.code === 'UNAUTHORIZED') {
      navigate('/login', { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) {
    <LoadingThreeDotsJumping />;
  }

  if (error?.data?.code === 'UNAUTHORIZED') {
    return null;
  }

  if (!data) {
    return null;
  }

  return <>{children}</>;
}
